-- Create projects table
create table if not exists public.projects (
  id bigint generated by default as identity primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text not null,
  git_link text,
  status text not null default 'pending'::text,
  user_id uuid references auth.users not null,
  constraint projects_status_check check (status in ('pending', 'approved', 'rejected'))
);

-- Set up Row Level Security (RLS)
alter table public.projects enable row level security;

-- Create policies
create policy "Anyone can view all projects"
  on public.projects for select
  using (true);

create policy "Authenticated users can insert projects"
  on public.projects for insert
  with check (auth.role() = 'authenticated');

create policy "Users can update their own projects"
  on public.projects for update
  using (auth.uid() = user_id);

-- Create indexes
create index projects_user_id_idx on public.projects(user_id);
create index projects_status_idx on public.projects(status); 