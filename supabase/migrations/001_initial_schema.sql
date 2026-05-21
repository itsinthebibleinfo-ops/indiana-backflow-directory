-- Indiana Backflow Testing Directory — Initial Schema

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ────────────────────────────────────────────────────────────
-- CITIES
-- ────────────────────────────────────────────────────────────
create table if not exists cities (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  county text,
  state text not null default 'Indiana',
  state_abbr text not null default 'IN',
  water_utility text,
  enforcement_portal text,
  population integer,
  latitude numeric(9,6),
  longitude numeric(9,6),
  seo_title text,
  seo_description text,
  intro_content text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cities_slug_idx on cities(slug);
create index if not exists cities_county_idx on cities(county);

-- ────────────────────────────────────────────────────────────
-- PROVIDERS
-- ────────────────────────────────────────────────────────────
create table if not exists providers (
  id uuid primary key default uuid_generate_v4(),
  business_name text not null,
  provider_slug text unique not null,
  contact_name text,
  license_number text,
  certification_type text,
  phone text,
  email text,
  website text,
  address text,
  city text,
  state text not null default 'IN',
  zip text,
  county text,
  latitude numeric(9,6),
  longitude numeric(9,6),
  service_areas text[] not null default '{}',
  service_types text[] not null default '{}',
  is_verified boolean not null default false,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  source_url text,
  source_name text,
  verification_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists providers_slug_idx on providers(provider_slug);
create index if not exists providers_city_idx on providers(city);
create index if not exists providers_county_idx on providers(county);
create index if not exists providers_verified_idx on providers(is_verified);
create index if not exists providers_featured_idx on providers(is_featured);

-- ────────────────────────────────────────────────────────────
-- PROVIDER_CITIES (junction)
-- ────────────────────────────────────────────────────────────
create table if not exists provider_cities (
  id uuid primary key default uuid_generate_v4(),
  provider_id uuid not null references providers(id) on delete cascade,
  city_id uuid not null references cities(id) on delete cascade,
  is_primary boolean not null default false,
  unique(provider_id, city_id)
);

create index if not exists provider_cities_provider_idx on provider_cities(provider_id);
create index if not exists provider_cities_city_idx on provider_cities(city_id);

-- ────────────────────────────────────────────────────────────
-- LEADS
-- ────────────────────────────────────────────────────────────
create table if not exists leads (
  id uuid primary key default uuid_generate_v4(),
  customer_name text not null,
  email text,
  phone text,
  property_type text,
  device_type text,
  service_address text,
  city_id uuid references cities(id),
  preferred_contact_method text,
  urgency text,
  message text,
  status text not null default 'new',
  assigned_provider_id uuid references providers(id),
  created_at timestamptz not null default now()
);

create index if not exists leads_city_idx on leads(city_id);
create index if not exists leads_created_idx on leads(created_at desc);
create index if not exists leads_status_idx on leads(status);

-- ────────────────────────────────────────────────────────────
-- CLAIM REQUESTS
-- ────────────────────────────────────────────────────────────
create table if not exists claim_requests (
  id uuid primary key default uuid_generate_v4(),
  provider_id uuid references providers(id),
  requester_name text,
  requester_email text,
  requester_phone text,
  verification_document_url text,
  status text not null default 'pending',
  admin_notes text,
  created_at timestamptz not null default now()
);

create index if not exists claim_requests_provider_idx on claim_requests(provider_id);
create index if not exists claim_requests_status_idx on claim_requests(status);

-- ────────────────────────────────────────────────────────────
-- CONTENT PAGES
-- ────────────────────────────────────────────────────────────
create table if not exists content_pages (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  meta_title text,
  meta_description text,
  content_markdown text,
  page_type text,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ────────────────────────────────────────────────────────────
-- SEO EVENTS
-- ────────────────────────────────────────────────────────────
create table if not exists seo_events (
  id uuid primary key default uuid_generate_v4(),
  url text,
  event_type text,
  notes text,
  created_at timestamptz not null default now()
);

-- ────────────────────────────────────────────────────────────
-- REMINDERS
-- ────────────────────────────────────────────────────────────
create table if not exists reminders (
  id uuid primary key default uuid_generate_v4(),
  email text not null,
  phone text,
  city_id uuid references cities(id),
  device_type text,
  due_date date,
  consent_to_reminders boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists reminders_email_idx on reminders(email);
create index if not exists reminders_due_date_idx on reminders(due_date);

-- ────────────────────────────────────────────────────────────
-- UPDATED_AT trigger helper
-- ────────────────────────────────────────────────────────────
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger cities_updated_at before update on cities
  for each row execute function update_updated_at_column();

create trigger providers_updated_at before update on providers
  for each row execute function update_updated_at_column();

create trigger content_pages_updated_at before update on content_pages
  for each row execute function update_updated_at_column();

-- ────────────────────────────────────────────────────────────
-- RLS POLICIES
-- ────────────────────────────────────────────────────────────
alter table cities enable row level security;
alter table providers enable row level security;
alter table provider_cities enable row level security;
alter table leads enable row level security;
alter table claim_requests enable row level security;
alter table content_pages enable row level security;
alter table seo_events enable row level security;
alter table reminders enable row level security;

-- Public read for directory data
create policy "Public read cities" on cities for select using (true);
create policy "Public read active providers" on providers for select using (is_active = true);
create policy "Public read provider_cities" on provider_cities for select using (true);
create policy "Public read published content" on content_pages for select using (published = true);

-- Public insert for leads, reminders, claims
create policy "Public insert leads" on leads for insert with check (true);
create policy "Public insert reminders" on reminders for insert with check (true);
create policy "Public insert claim_requests" on claim_requests for insert with check (true);

-- Service role has full access (bypasses RLS)
