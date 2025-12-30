-- Secure Legal Entities
alter table legal_entities 
add column if not exists owner_user_id uuid default auth.uid();

create index if not exists legal_entities_owner_idx on legal_entities(owner_user_id);

-- Update RLS for Legal Entities
drop policy if exists "Enable all access for authenticated users" on legal_entities;

create policy "Users can view own entities"
on legal_entities for select
to authenticated
using ( auth.uid() = owner_user_id );

create policy "Users can insert own entities"
on legal_entities for insert
to authenticated
with check ( auth.uid() = owner_user_id );

create policy "Users can update own entities"
on legal_entities for update
to authenticated
using ( auth.uid() = owner_user_id );

create policy "Users can delete own entities"
on legal_entities for delete
to authenticated
using ( auth.uid() = owner_user_id );


-- Update RLS for Entity Addresses (Subquery Check)
drop policy if exists "Enable all access for authenticated person" on entity_addresses;

create policy "Users can view own entity addresses"
on entity_addresses for select
to authenticated
using ( 
    entity_id in (
        select id from legal_entities where owner_user_id = auth.uid()
    )
);

create policy "Users can insert own entity addresses"
on entity_addresses for insert
to authenticated
with check ( 
    entity_id in (
        select id from legal_entities where owner_user_id = auth.uid()
    )
);

create policy "Users can update own entity addresses"
on entity_addresses for update
to authenticated
using ( 
    entity_id in (
        select id from legal_entities where owner_user_id = auth.uid()
    )
);

create policy "Users can delete own entity addresses"
on entity_addresses for delete
to authenticated
using ( 
    entity_id in (
        select id from legal_entities where owner_user_id = auth.uid()
    )
);

-- Note: For 'contacts', we have both entity_id and user_id.
-- Let's secure it simply for now by checking ownership of the linked entity OR matching user_id.

drop policy if exists "Enable all access for authenticated users" on contacts;

create policy "Users can manage their contacts"
on contacts for all
to authenticated
using (
    (user_id = auth.uid()) 
    OR 
    (entity_id in (select id from legal_entities where owner_user_id = auth.uid()))
)
with check (
    (user_id = auth.uid()) 
    OR 
    (entity_id in (select id from legal_entities where owner_user_id = auth.uid()))
);
