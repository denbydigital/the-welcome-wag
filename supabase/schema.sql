-- Welcome Wag — Supabase schema
-- Run this in the Supabase SQL editor (or use supabase db push)

-- ============================================================
-- PROFILES (auto-created on signup via trigger)
-- ============================================================
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  created_at timestamptz default now()
);

-- ============================================================
-- DOGS
-- ============================================================
create table if not exists public.dogs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  breed text,
  age_value integer,
  age_unit text default 'weeks',
  weight_kg numeric,
  background text,
  postcode text,
  suburb text,
  stage text,
  arrival_status text,
  vet_name text,
  first_time_owner boolean default true,
  is_current boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- SHOPPING CHECKLIST STATE
-- ============================================================
create table if not exists public.shopping_items (
  id uuid default gen_random_uuid() primary key,
  dog_id uuid references public.dogs on delete cascade not null,
  item_key text not null,
  have boolean default false,
  unique(dog_id, item_key)
);

-- ============================================================
-- TIMELINE COMPLETIONS
-- ============================================================
create table if not exists public.timeline_completions (
  id uuid default gen_random_uuid() primary key,
  dog_id uuid references public.dogs on delete cascade not null,
  item_key text not null,
  unique(dog_id, item_key)
);

-- ============================================================
-- VET RECORDS
-- ============================================================
create table if not exists public.vet_records (
  id uuid default gen_random_uuid() primary key,
  dog_id uuid references public.dogs on delete cascade not null,
  record_type text not null,
  title text not null,
  notes text,
  date date,
  due_date date,
  status text default 'pending',
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles enable row level security;
alter table public.dogs enable row level security;
alter table public.shopping_items enable row level security;
alter table public.timeline_completions enable row level security;
alter table public.vet_records enable row level security;

-- Profiles: users can read/write their own row
create policy "profiles: own row" on public.profiles
  for all using (auth.uid() = id);

-- Dogs: users can CRUD their own dogs
create policy "dogs: own rows" on public.dogs
  for all using (auth.uid() = user_id);

-- Shopping items: access via dog ownership
create policy "shopping_items: via dog" on public.shopping_items
  for all using (
    exists (
      select 1 from public.dogs
      where dogs.id = shopping_items.dog_id
        and dogs.user_id = auth.uid()
    )
  );

-- Timeline completions: access via dog ownership
create policy "timeline_completions: via dog" on public.timeline_completions
  for all using (
    exists (
      select 1 from public.dogs
      where dogs.id = timeline_completions.dog_id
        and dogs.user_id = auth.uid()
    )
  );

-- Vet records: access via dog ownership
create policy "vet_records: via dog" on public.vet_records
  for all using (
    exists (
      select 1 from public.dogs
      where dogs.id = vet_records.dog_id
        and dogs.user_id = auth.uid()
    )
  );

-- ============================================================
-- TRIGGER: auto-create profile on signup
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Drop and recreate trigger to avoid duplicates
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
