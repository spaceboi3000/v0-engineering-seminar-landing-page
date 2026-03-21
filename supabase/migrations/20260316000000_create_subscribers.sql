create table if not exists subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  token uuid not null,
  confirmed boolean not null default false,
  subscribed_at timestamptz not null,
  confirmed_at timestamptz
);
