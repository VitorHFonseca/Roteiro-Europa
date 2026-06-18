-- Roteiro Europa: contas no banco via Supabase Auth + profiles
-- Execute inteiro no Supabase > SQL Editor.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  name text,
  role text not null default 'user' check (role in ('admin','user')),
  status text not null default 'active' check (status in ('active','blocked','deleted')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

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

drop policy if exists "profiles update own name" on public.profiles;
create policy "profiles update own name"
on public.profiles for update
using (auth.uid() = id or public.is_admin())
with check (auth.uid() = id or public.is_admin());

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, role, status)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)),
    'user',
    'active'
  )
  on conflict (id) do update
    set email = excluded.email,
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
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  insert into public.profiles (id, email, name, role, status)
  values (
    auth.uid(),
    coalesce(auth.jwt()->>'email',''),
    coalesce(auth.jwt()->>'email','Usuário'),
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
  select p.id, p.email, p.name, p.role, p.status, p.created_at, p.updated_at
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
