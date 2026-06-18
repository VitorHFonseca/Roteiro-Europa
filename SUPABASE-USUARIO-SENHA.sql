-- Roteiro Europa: login por nome de usuário + troca de senha pelo ADM
-- Execute inteiro no Supabase > SQL Editor.
-- Pode rodar mesmo se as tabelas antigas já existirem.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  username text,
  name text,
  role text not null default 'user' check (role in ('admin','user')),
  status text not null default 'active' check (status in ('active','blocked','deleted')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles add column if not exists username text;

create unique index if not exists profiles_username_unique
on public.profiles (lower(username))
where username is not null and status <> 'deleted';

alter table public.profiles enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
      and status = 'active'
  );
$$;

drop policy if exists "profiles select own or admin" on public.profiles;
create policy "profiles select own or admin"
on public.profiles for select
using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles update admin only" on public.profiles;
create policy "profiles update admin only"
on public.profiles for update
using (public.is_admin())
with check (public.is_admin());

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  chosen_username text;
begin
  chosen_username := lower(
    regexp_replace(
      coalesce(new.raw_user_meta_data->>'username', split_part(new.email,'@',1)),
      '[^a-zA-Z0-9_]+',
      '',
      'g'
    )
  );

  if chosen_username = '' then
    chosen_username := split_part(new.email,'@',1);
  end if;

  insert into public.profiles (id, email, username, name, role, status)
  values (
    new.id,
    new.email,
    chosen_username,
    coalesce(new.raw_user_meta_data->>'name', chosen_username),
    'user',
    'active'
  )
  on conflict (id) do update
    set email = excluded.email,
        username = coalesce(public.profiles.username, excluded.username),
        name = coalesce(public.profiles.name, excluded.name),
        updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.claim_first_admin()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  did_claim boolean := false;
  chosen_username text;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  chosen_username := lower(
    regexp_replace(
      coalesce(auth.jwt()->'user_metadata'->>'username', split_part(coalesce(auth.jwt()->>'email','usuario'),'@',1)),
      '[^a-zA-Z0-9_]+',
      '',
      'g'
    )
  );

  if chosen_username = '' then
    chosen_username := 'usuario';
  end if;

  insert into public.profiles (id, email, username, name, role, status)
  values (
    auth.uid(),
    coalesce(auth.jwt()->>'email',''),
    chosen_username,
    coalesce(auth.jwt()->'user_metadata'->>'name', chosen_username),
    'user',
    'active'
  )
  on conflict (id) do nothing;

  if not exists (
    select 1 from public.profiles
    where role = 'admin' and status = 'active'
  ) then
    update public.profiles
    set role = 'admin',
        status = 'active',
        updated_at = now()
    where id = auth.uid();

    did_claim := true;
  end if;

  return did_claim;
end;
$$;

create or replace function public.admin_list_profiles()
returns table (
  id uuid,
  email text,
  username text,
  name text,
  role text,
  status text,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'admin required';
  end if;

  return query
  select p.id, p.email, p.username, p.name, p.role, p.status, p.created_at, p.updated_at
  from public.profiles p
  where p.status <> 'deleted'
  order by p.created_at asc;
end;
$$;

create or replace function public.admin_set_profile(
  target_id uuid,
  new_role text default null,
  new_status text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'admin required';
  end if;

  if new_role is not null and new_role not in ('admin','user') then
    raise exception 'invalid role';
  end if;

  if new_status is not null and new_status not in ('active','blocked','deleted') then
    raise exception 'invalid status';
  end if;

  if target_id = auth.uid() and new_status in ('blocked','deleted') then
    raise exception 'admin cannot block/delete itself';
  end if;

  update public.profiles
  set role = coalesce(new_role, role),
      status = coalesce(new_status, status),
      updated_at = now()
  where id = target_id;

  if not found then
    raise exception 'profile not found';
  end if;
end;
$$;

create or replace function public.admin_soft_delete_profile(target_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'admin required';
  end if;

  if target_id = auth.uid() then
    raise exception 'admin cannot delete itself';
  end if;

  update public.profiles
  set status = 'deleted',
      updated_at = now()
  where id = target_id;

  delete from public.trip_states where user_id = target_id;
end;
$$;

create or replace function public.admin_change_user_password(
  target_id uuid,
  new_password text
)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if not public.is_admin() then
    raise exception 'admin required';
  end if;

  if new_password is null or length(new_password) < 6 then
    raise exception 'password too short';
  end if;

  if not exists (
    select 1 from public.profiles
    where id = target_id
      and status <> 'deleted'
  ) then
    raise exception 'profile not found';
  end if;

  update auth.users
  set encrypted_password = crypt(new_password, gen_salt('bf')),
      updated_at = now(),
      email_confirmed_at = coalesce(email_confirmed_at, now())
  where id = target_id;

  if not found then
    raise exception 'auth user not found';
  end if;
end;
$$;

create table if not exists public.trip_states (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null,
  updated_at timestamptz default now()
);

alter table public.trip_states enable row level security;

drop policy if exists "select own trip state" on public.trip_states;
create policy "select own trip state"
on public.trip_states for select
using (auth.uid() = user_id or public.is_admin());

drop policy if exists "insert own trip state" on public.trip_states;
create policy "insert own trip state"
on public.trip_states for insert
with check (auth.uid() = user_id);

drop policy if exists "update own trip state" on public.trip_states;
create policy "update own trip state"
on public.trip_states for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "delete own trip state" on public.trip_states;
create policy "delete own trip state"
on public.trip_states for delete
using (auth.uid() = user_id or public.is_admin());
