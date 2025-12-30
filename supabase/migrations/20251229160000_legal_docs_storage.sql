-- Create Storage Bucket for Legal Documents
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'legal-documents', 
  'legal-documents', 
  false, 
  10485760, -- 10MB
  '{application/pdf,image/png,image/jpeg}'
)
on conflict (id) do nothing;

-- Storage RLS Policies
-- Helper policy for ownership check via legal_entities
create or replace function is_entity_owner(entity_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from legal_entities 
    where id = entity_id 
    and owner_user_id = auth.uid()
  );
end;
$$ language plpgsql security definer;

-- Upload Policy
drop policy if exists "Users can upload own legal docs" on storage.objects;
create policy "Users can upload own legal docs"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'legal-documents' 
  and is_entity_owner((storage.foldername(name))[1]::uuid)
);

-- View Policy
drop policy if exists "Users can view own legal docs" on storage.objects;
create policy "Users can view own legal docs"
on storage.objects for select
to authenticated
using (
  bucket_id = 'legal-documents'
  and is_entity_owner((storage.foldername(name))[1]::uuid)
);

-- Delete Policy
drop policy if exists "Users can delete own legal docs" on storage.objects;
create policy "Users can delete own legal docs"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'legal-documents'
  and is_entity_owner((storage.foldername(name))[1]::uuid)
);
