begin;
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('study-documents','study-documents',false,10485760,array['application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document','text/plain'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;
-- Private documents cannot be enumerated by anonymous or non-approved accounts.
create policy study_documents_read on storage.objects for select to authenticated
using (bucket_id = 'study-documents' and (select public.study_is_owner()) and (storage.foldername(name))[1] = (select auth.uid())::text);
-- No upload/update/delete policy until the document validation and audit pipeline exists.
-- Uploads are intentionally disabled in Phase 1. Never create public URLs for this bucket.
commit;
