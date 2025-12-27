-- Create member_subscriptions table for Members (Stripe)
create table if not exists public.member_subscriptions (
  id uuid default gen_random_uuid() primary key,
  member_id uuid references public.members(id) on delete cascade not null,
  
  stripe_subscription_id text unique not null,
  stripe_customer_id text not null,
  stripe_price_id text not null,
  
  status text not null, -- active, trailing, past_due, canceled, etc.
  cancel_at_period_end boolean default false,
  current_period_end timestamptz not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  
  metadata jsonb default '{}'::jsonb
);

-- Indexes
create index if not exists idx_member_subscriptions_member_id on public.member_subscriptions(member_id);
create index if not exists idx_member_subscriptions_stripe_sub_id on public.member_subscriptions(stripe_subscription_id);
create index if not exists idx_member_subscriptions_status on public.member_subscriptions(status);

-- RLS
alter table public.member_subscriptions enable row level security;

-- Policy: Authenticated users can view their own subscription
create policy "Users can view own subscription"
  on public.member_subscriptions
  for select
  to authenticated
  using (
    exists (
      select 1 from public.members
      where members.id = member_subscriptions.member_id
      and members.clerk_user_id = (select auth.jwt() ->> 'sub') 
    )
  );

-- Function to update updated_at
create or replace function public.handle_member_subscriptions_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_member_subscription_updated
  before update on public.member_subscriptions
  for each row execute procedure public.handle_member_subscriptions_updated_at();
