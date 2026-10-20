-- Supabase default privileges can grant anon EXECUTE independently of PUBLIC.
-- Authenticated execution is intentional: this boolean helper checks auth.uid()
-- against the private allowlist and never accepts a caller-supplied identity.
begin;
revoke all on function public.study_is_owner() from public, anon;
grant execute on function public.study_is_owner() to authenticated;
commit;
