-- ============================================================================
-- Portfolio Mikael — schéma Supabase
-- À exécuter dans le SQL Editor de Supabase (ou via supabase db push).
-- Idempotent : utilise CREATE TABLE IF NOT EXISTS.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Profil (ligne unique id=1, données JSONB)
-- ---------------------------------------------------------------------------
create table if not exists profile (
  id integer primary key default 1,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Paramètres du site (ligne unique id=1, données JSONB)
-- ---------------------------------------------------------------------------
create table if not exists settings (
  id integer primary key default 1,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Projets
-- ---------------------------------------------------------------------------
create table if not exists projects (
  id text primary key,
  title text not null,
  slug text not null unique,
  category text not null default 'Autre',
  description text not null default '',
  image text not null default '',
  technologies jsonb not null default '[]'::jsonb,
  live_url text,
  github_url text,
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists projects_sort_order_idx on projects (sort_order);

-- ---------------------------------------------------------------------------
-- Compétences
-- ---------------------------------------------------------------------------
create table if not exists skills (
  id text primary key,
  name text not null,
  percentage integer not null default 50 check (percentage between 0 and 100)
);

-- ---------------------------------------------------------------------------
-- Étapes de processus
-- ---------------------------------------------------------------------------
create table if not exists process_steps (
  id text primary key,
  number text not null,
  title text not null,
  description text not null default '',
  icon text not null default 'ChevronRight'
);

-- ---------------------------------------------------------------------------
-- Statistiques
-- ---------------------------------------------------------------------------
create table if not exists stats (
  id text primary key,
  label text not null,
  value numeric not null default 0,
  suffix text not null default ''
);

-- ---------------------------------------------------------------------------
-- Messages de contact
-- ---------------------------------------------------------------------------
create table if not exists messages (
  id text primary key,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status text not null default 'new' check (status in ('new', 'read', 'replied', 'archived')),
  created_at timestamptz not null default now()
);
create index if not exists messages_created_at_idx on messages (created_at desc);

-- ---------------------------------------------------------------------------
-- Journal d'activité (100 dernières entrées conservées côté app)
-- ---------------------------------------------------------------------------
create table if not exists activity (
  id text primary key,
  type text not null,
  description text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists activity_created_at_idx on activity (created_at desc);

-- ---------------------------------------------------------------------------
-- Sécurité : le site accède uniquement via la clé service_role (bypass RLS)
-- et la clé anon ne doit rien voir. RLS activée, aucune policy publique.
-- ---------------------------------------------------------------------------
alter table profile enable row level security;
alter table settings enable row level security;
alter table projects enable row level security;
alter table skills enable row level security;
alter table process_steps enable row level security;
alter table stats enable row level security;
alter table messages enable row level security;
alter table activity enable row level security;
