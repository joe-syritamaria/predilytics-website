create table if not exists gemla_products (
  id text primary key,
  name text not null,
  version text not null,
  stripe_price_id text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists gemla_orders (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  product_id text not null references gemla_products(id),
  stripe_session_id text unique,
  stripe_payment_intent_id text,
  status text not null default 'pending',
  amount_total integer,
  currency text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists gemla_entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  product_id text not null references gemla_products(id),
  status text not null default 'active',
  license_type text not null default 'one_time',
  granted_at timestamptz not null default now(),
  revoked_at timestamptz,
  unique(user_id, product_id)
);

create table if not exists gemla_results (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references gemla_products(id),
  title text not null,
  slug text not null unique,
  summary text,
  body_md text,
  status text not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists gemla_exports (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  product_id text not null references gemla_products(id),
  result_id uuid references gemla_results(id),
  file_path text,
  export_type text not null,
  watermark_id text not null,
  download_count integer not null default 0,
  created_at timestamptz not null default now(),
  last_downloaded_at timestamptz
);

create table if not exists gemla_test_runs (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  product_id text not null references gemla_products(id),
  input_json jsonb not null,
  output_json jsonb,
  status text not null default 'queued',
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists gemla_audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id text,
  product_id text,
  event_type text not null,
  ip_country text,
  ip_address text,
  user_agent text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

insert into gemla_products (
  id,
  name,
  version,
  stripe_price_id
)
values (
  'gemla_zeta_v1',
  'GEMLA-Zeta RH Test Scaffold v1.0',
  'v1.0',
  'prod_UlcHFf8YedMjWr'
)
on conflict (id) do update set
  name = excluded.name,
  version = excluded.version,
  stripe_price_id = excluded.stripe_price_id,
  active = true;