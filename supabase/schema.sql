-- ============================================================
-- Thambuli, Saaru & Bajji — Supabase Database Schema
-- Run this in the Supabase SQL editor in order.
-- ============================================================


-- ── 1. Enable UUID generation ────────────────────────────────
create extension if not exists "pgcrypto";


-- ── 2. categories ────────────────────────────────────────────
create table categories (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,          -- e.g. "thambuli"
  name             text not null,                 -- e.g. "Thambuli"
  description      text,
  cover_image_url  text,
  sort_order       integer not null default 0
);

insert into categories (slug, name, description, sort_order) values
  ('thambuli', 'Thambuli', 'Yogurt-based salads',        1),
  ('saaru',    'Saaru',    'Rasam and soups',             2),
  ('bajji',    'Bajji',    'Fritters and snacks',         3),
  ('sides',    'Sides',    'Rice, rotis and accompaniments', 4),
  ('sweets',   'Sweets',   'Desserts and treats',         5),
  ('drinks',   'Drinks',   'Beverages',                   6);


-- ── 3. tags ──────────────────────────────────────────────────
create table tags (
  id    uuid primary key default gen_random_uuid(),
  slug  text not null unique,    -- e.g. "vegetarian"
  name  text not null            -- e.g. "Vegetarian"
);

insert into tags (slug, name) values
  ('vegetarian',  'Vegetarian'),
  ('quick',       'Quick'),
  ('festive',     'Festive'),
  ('summer',      'Summer'),
  ('monsoon',     'Monsoon'),
  ('no-cook',     'No cook'),
  ('spicy',       'Spicy'),
  ('mild',        'Mild'),
  ('heirloom',    'Heirloom');


-- ── 4. recipes ───────────────────────────────────────────────
create table recipes (

  -- Identity
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,
  title            text not null,
  title_kannada    text,

  -- Classification
  category_id      uuid not null references categories(id),
  source           text not null check (source in ('mom', 'family')),
  contributor_name text,          -- e.g. "Ajji", "Chikkamma" — for family recipes
  is_featured      boolean not null default false,
  is_published     boolean not null default false,
  is_new           boolean not null default false,  -- manual flag for the Newly Added strip

  -- Description
  description      text not null,   -- short card summary (1–2 sentences)
  family_notes     text,            -- personal story or memory
  moms_tips        text,            -- general amma tips (separate from per-step tips)

  -- Timing & serving
  prep_time_mins   integer not null,
  cook_time_mins   integer not null,
  servings         integer not null,
  difficulty       text not null check (difficulty in ('easy', 'medium', 'hard')),
  spice_level      integer not null check (spice_level between 1 and 3),

  -- Content (jsonb arrays — see comments below for structure)
  --
  -- ingredients: [{name, qty, unit, note}]
  --   name: string (required)
  --   qty:  number | null  (null = "to taste")
  --   unit: string | null  (null = countable, no unit)
  --   note: string | null  (e.g. "grated", "roughly chopped")
  --
  -- steps: [{order, instruction, tip}]
  --   order:       integer (required)
  --   instruction: string  (required)
  --   tip:         string | null (amma's note for this specific step)
  --
  ingredients      jsonb not null default '[]',
  steps            jsonb not null default '[]',

  -- Media
  hero_image_url   text,
  gallery_urls     text[] default '{}',

  -- Metadata
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);


-- ── 5. recipe_tags (junction) ────────────────────────────────
create table recipe_tags (
  recipe_id  uuid not null references recipes(id) on delete cascade,
  tag_id     uuid not null references tags(id)    on delete cascade,
  primary key (recipe_id, tag_id)
);


-- ── 6. Auto-update updated_at ────────────────────────────────
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger recipes_updated_at
  before update on recipes
  for each row execute function update_updated_at();


-- ── 7. Row Level Security ────────────────────────────────────
-- Public can read published recipes and all reference tables.
-- Only authenticated users (you) can insert/update/delete.

alter table recipes      enable row level security;
alter table categories   enable row level security;
alter table tags         enable row level security;
alter table recipe_tags  enable row level security;

-- Anyone can read published recipes
create policy "Public can read published recipes"
  on recipes for select
  using (is_published = true);

-- Authenticated users can do everything
create policy "Auth users have full access to recipes"
  on recipes for all
  using (auth.role() = 'authenticated');

-- Categories and tags are always public
create policy "Public can read categories"
  on categories for select using (true);

create policy "Auth users manage categories"
  on categories for all using (auth.role() = 'authenticated');

create policy "Public can read tags"
  on tags for select using (true);

create policy "Auth users manage tags"
  on tags for all using (auth.role() = 'authenticated');

create policy "Public can read recipe_tags"
  on recipe_tags for select using (true);

create policy "Auth users manage recipe_tags"
  on recipe_tags for all using (auth.role() = 'authenticated');


-- ── 8. Useful indexes ────────────────────────────────────────
create index on recipes (category_id);
create index on recipes (slug);
create index on recipes (is_published, created_at desc);
create index on recipes (is_new, created_at desc);
create index on recipe_tags (recipe_id);
create index on recipe_tags (tag_id);

-- ============================================================
-- Done. Tables: categories, tags, recipes, recipe_tags
-- ============================================================
