create table
  public.users (
    username text null,
    password text null,
    uid uuid not null default gen_random_uuid (),
    name text null,
    constraint users_pkey primary key (uid)
  ) tablespace pg_default;
