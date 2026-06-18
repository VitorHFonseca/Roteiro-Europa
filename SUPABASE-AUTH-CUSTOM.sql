-- Roteiro Europa: autenticação própria por nome + senha no banco
-- Não usa Supabase Auth, não usa e-mail, não dispara confirmação e não sofre limite de e-mail.
-- Execute inteiro no Supabase > SQL Editor.

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.app_users (
  id uuid primary key default gen_random_uuid(),
  username text not null,
  name text,
  password_hash text not null,
  role text not null default 'user' check (role in ('admin','user')),
  status text not null default 'active' check (status in ('active','blocked','deleted')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create unique index if not exists app_users_username_unique
on public.app_users (lower(username))
where status <> 'deleted';

create table if not exists public.app_sessions (
  token_hash text primary key,
  user_id uuid not null references public.app_users(id) on delete cascade,
  created_at timestamptz default now(),
  expires_at timestamptz default (now() + interval '30 days')
);

create table if not exists public.app_states (
  user_id uuid primary key references public.app_users(id) on delete cascade,
  state jsonb not null,
  updated_at timestamptz default now()
);

alter table public.app_users enable row level security;
alter table public.app_sessions enable row level security;
alter table public.app_states enable row level security;

revoke all on public.app_users from anon, authenticated;
revoke all on public.app_sessions from anon, authenticated;
revoke all on public.app_states from anon, authenticated;

create or replace function public._clean_username(p_username text)
returns text
language sql
immutable
as $$
  select lower(regexp_replace(coalesce(trim(p_username), ''), '[^a-zA-Z0-9_]+', '', 'g'));
$$;

create or replace function public._hash_token(p_token text)
returns text
language sql
immutable
as $$
  select encode(digest(coalesce(p_token,''), 'sha256'), 'hex');
$$;

create or replace function public._new_token()
returns text
language sql
volatile
as $$
  select encode(gen_random_bytes(32), 'hex');
$$;

create or replace function public._current_user_id(p_token text)
returns uuid
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_user_id uuid;
begin
  select s.user_id
  into v_user_id
  from public.app_sessions s
  join public.app_users u on u.id = s.user_id
  where s.token_hash = public._hash_token(p_token)
    and s.expires_at > now()
    and u.status = 'active';

  if v_user_id is null then
    raise exception 'invalid session';
  end if;

  return v_user_id;
end;
$$;

create or replace function public._is_admin(p_token text)
returns boolean
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_ok boolean;
begin
  select exists(
    select 1
    from public.app_sessions s
    join public.app_users u on u.id = s.user_id
    where s.token_hash = public._hash_token(p_token)
      and s.expires_at > now()
      and u.role = 'admin'
      and u.status = 'active'
  ) into v_ok;

  return coalesce(v_ok,false);
end;
$$;

create or replace function public.app_register(
  p_username text,
  p_name text,
  p_password text
)
returns table (
  id uuid,
  username text,
  name text,
  role text,
  status text,
  token text
)
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_username text;
  v_role text;
  v_user_id uuid;
  v_token text;
begin
  v_username := public._clean_username(p_username);

  if length(v_username) < 2 then
    raise exception 'username too short';
  end if;

  if p_password is null or length(p_password) < 6 then
    raise exception 'password too short';
  end if;

  if exists(select 1 from public.app_users where lower(app_users.username) = v_username and app_users.status <> 'deleted') then
    raise exception 'username already exists';
  end if;

  if not exists(select 1 from public.app_users where app_users.role = 'admin' and app_users.status = 'active') then
    v_role := 'admin';
  else
    v_role := 'user';
  end if;

  insert into public.app_users (username, name, password_hash, role, status)
  values (
    v_username,
    coalesce(nullif(trim(p_name), ''), v_username),
    crypt(p_password, gen_salt('bf')),
    v_role,
    'active'
  )
  returning app_users.id into v_user_id;

  v_token := public._new_token();

  insert into public.app_sessions (token_hash, user_id)
  values (public._hash_token(v_token), v_user_id);

  return query
  select u.id, u.username, u.name, u.role, u.status, v_token
  from public.app_users u
  where u.id = v_user_id;
end;
$$;

create or replace function public.app_login(
  p_username text,
  p_password text
)
returns table (
  id uuid,
  username text,
  name text,
  role text,
  status text,
  token text
)
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_username text;
  v_user public.app_users%rowtype;
  v_token text;
begin
  v_username := public._clean_username(p_username);

  select *
  into v_user
  from public.app_users
  where lower(app_users.username) = v_username
    and app_users.status <> 'deleted'
  limit 1;

  if v_user.id is null then
    raise exception 'invalid login';
  end if;

  if v_user.status = 'blocked' then
    raise exception 'user blocked';
  end if;

  if v_user.password_hash <> crypt(p_password, v_user.password_hash) then
    raise exception 'invalid login';
  end if;

  v_token := public._new_token();

  insert into public.app_sessions (token_hash, user_id)
  values (public._hash_token(v_token), v_user.id);

  return query
  select v_user.id, v_user.username, v_user.name, v_user.role, v_user.status, v_token;
end;
$$;

create or replace function public.app_current_user(p_token text)
returns table (
  id uuid,
  username text,
  name text,
  role text,
  status text
)
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_user_id uuid;
begin
  v_user_id := public._current_user_id(p_token);

  return query
  select u.id, u.username, u.name, u.role, u.status
  from public.app_users u
  where u.id = v_user_id;
end;
$$;

create or replace function public.app_logout(p_token text)
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  delete from public.app_sessions
  where token_hash = public._hash_token(p_token);
end;
$$;

create or replace function public.app_save_state(
  p_token text,
  p_state jsonb
)
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_user_id uuid;
begin
  v_user_id := public._current_user_id(p_token);

  insert into public.app_states (user_id, state, updated_at)
  values (v_user_id, p_state, now())
  on conflict (user_id) do update
    set state = excluded.state,
        updated_at = now();
end;
$$;

create or replace function public.app_get_state(p_token text)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_user_id uuid;
  v_state jsonb;
begin
  v_user_id := public._current_user_id(p_token);

  select state
  into v_state
  from public.app_states
  where user_id = v_user_id;

  return v_state;
end;
$$;

create or replace function public.admin_list_app_users(p_token text)
returns table (
  id uuid,
  username text,
  name text,
  role text,
  status text,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  if not public._is_admin(p_token) then
    raise exception 'admin required';
  end if;

  return query
  select u.id, u.username, u.name, u.role, u.status, u.created_at, u.updated_at
  from public.app_users u
  where u.status <> 'deleted'
  order by u.created_at asc;
end;
$$;

create or replace function public.admin_create_app_user(
  p_token text,
  p_username text,
  p_name text,
  p_password text,
  p_role text default 'user'
)
returns uuid
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_username text;
  v_user_id uuid;
  v_role text;
begin
  if not public._is_admin(p_token) then
    raise exception 'admin required';
  end if;

  v_username := public._clean_username(p_username);
  v_role := case when p_role = 'admin' then 'admin' else 'user' end;

  if length(v_username) < 2 then
    raise exception 'username too short';
  end if;

  if p_password is null or length(p_password) < 6 then
    raise exception 'password too short';
  end if;

  if exists(select 1 from public.app_users where lower(app_users.username) = v_username and app_users.status <> 'deleted') then
    raise exception 'username already exists';
  end if;

  insert into public.app_users (username, name, password_hash, role, status)
  values (
    v_username,
    coalesce(nullif(trim(p_name), ''), v_username),
    crypt(p_password, gen_salt('bf')),
    v_role,
    'active'
  )
  returning id into v_user_id;

  return v_user_id;
end;
$$;

create or replace function public.admin_set_app_user(
  p_token text,
  p_user_id uuid,
  p_role text default null,
  p_status text default null
)
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_admin_id uuid;
begin
  if not public._is_admin(p_token) then
    raise exception 'admin required';
  end if;

  v_admin_id := public._current_user_id(p_token);

  if p_user_id = v_admin_id and p_status in ('blocked','deleted') then
    raise exception 'admin cannot block/delete itself';
  end if;

  update public.app_users
  set role = coalesce(case when p_role in ('admin','user') then p_role else null end, role),
      status = coalesce(case when p_status in ('active','blocked','deleted') then p_status else null end, status),
      updated_at = now()
  where id = p_user_id;

  if not found then
    raise exception 'user not found';
  end if;
end;
$$;

create or replace function public.admin_delete_app_user(
  p_token text,
  p_user_id uuid
)
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_admin_id uuid;
begin
  if not public._is_admin(p_token) then
    raise exception 'admin required';
  end if;

  v_admin_id := public._current_user_id(p_token);

  if p_user_id = v_admin_id then
    raise exception 'admin cannot delete itself';
  end if;

  update public.app_users
  set status = 'deleted',
      updated_at = now()
  where id = p_user_id;

  delete from public.app_sessions where user_id = p_user_id;
  delete from public.app_states where user_id = p_user_id;
end;
$$;

create or replace function public.admin_change_app_password(
  p_token text,
  p_user_id uuid,
  p_password text
)
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  if not public._is_admin(p_token) then
    raise exception 'admin required';
  end if;

  if p_password is null or length(p_password) < 6 then
    raise exception 'password too short';
  end if;

  update public.app_users
  set password_hash = crypt(p_password, gen_salt('bf')),
      updated_at = now()
  where id = p_user_id
    and status <> 'deleted';

  if not found then
    raise exception 'user not found';
  end if;

  delete from public.app_sessions where user_id = p_user_id;
end;
$$;

grant execute on function public.app_register(text,text,text) to anon, authenticated;
grant execute on function public.app_login(text,text) to anon, authenticated;
grant execute on function public.app_current_user(text) to anon, authenticated;
grant execute on function public.app_logout(text) to anon, authenticated;
grant execute on function public.app_save_state(text,jsonb) to anon, authenticated;
grant execute on function public.app_get_state(text) to anon, authenticated;
grant execute on function public.admin_list_app_users(text) to anon, authenticated;
grant execute on function public.admin_create_app_user(text,text,text,text,text) to anon, authenticated;
grant execute on function public.admin_set_app_user(text,uuid,text,text) to anon, authenticated;
grant execute on function public.admin_delete_app_user(text,uuid) to anon, authenticated;
grant execute on function public.admin_change_app_password(text,uuid,text) to anon, authenticated;
