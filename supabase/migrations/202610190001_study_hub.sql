-- Study Hub foundation. Apply only to a dedicated Supabase project.
-- No owner identity or private records are seeded in this public migration.
begin;
create schema if not exists study_private;
revoke all on schema study_private from public, anon, authenticated;
create table study_private.approved_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
create or replace function public.study_is_owner() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists(select 1 from study_private.approved_users where user_id = (select auth.uid()));
$$;
revoke all on function public.study_is_owner() from public;
grant execute on function public.study_is_owner() to authenticated;

create table public.study_universities (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null default auth.uid() references auth.users(id),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 name text not null, country text not null, official_url text not null, unique(owner_id, official_url),
 unique(id,owner_id)
);

create table public.study_programmes (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null default auth.uid() references auth.users(id),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 university_id uuid not null, name text not null, degree text not null check (degree in ('masters','phd')), official_url text not null, direct_entry boolean, unique(owner_id, official_url),
 unique(id,owner_id)
);

create table public.study_scholarships (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null default auth.uid() references auth.users(id),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 name text not null, official_url text not null, coverage jsonb not null default '{}'::jsonb, currency text check (currency ~ '^[A-Z]{3}$'), amount numeric check (amount >= 0), unique(owner_id, official_url),
 unique(id,owner_id)
);

create table public.study_programme_scholarships (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null default auth.uid() references auth.users(id),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 programme_id uuid not null, scholarship_id uuid not null, unique(owner_id,programme_id,scholarship_id),
 unique(id,owner_id)
);

create table public.study_laboratories (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null default auth.uid() references auth.users(id),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 university_id uuid not null, name text not null, official_url text not null, unique(owner_id,official_url),
 unique(id,owner_id)
);

create table public.study_professors (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null default auth.uid() references auth.users(id),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 university_id uuid not null, laboratory_id uuid, name text not null, profile_url text not null, research_interests text[] not null default '{}', recruiting_status text not null default 'unknown' check (recruiting_status in ('unknown','recruiting','closed')), unique(owner_id,profile_url),
 unique(id,owner_id)
);

create table public.study_recruitment_posts (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null default auth.uid() references auth.users(id),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 professor_id uuid, laboratory_id uuid, title text not null, source_url text not null, published_at timestamptz, retrieved_at timestamptz not null default now(), unique(owner_id,source_url),
 unique(id,owner_id)
);

create table public.study_opportunities (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null default auth.uid() references auth.users(id),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 programme_id uuid, professor_id uuid, recruitment_post_id uuid,
 title text not null check (length(title) between 3 and 200),
 kind text not null check (kind in ('masters','phd')),
 country text not null check (length(country) between 2 and 80),
 official_url text not null check (official_url ~ '^https://'),
 canonical_url text not null check (canonical_url ~ '^https://'),
 funding text not null default 'unknown' check (funding in ('unknown','full','partial','none')),
 status text not null default 'discovered' check (status in ('discovered','bookmarked','shortlisted','preparing','submitted','rejected')),
 verification_status text not null default 'unverified' check (verification_status in ('unverified','verified','stale','conflicting')),
 notes text not null default '' check (length(notes) <= 5000),
 unique(owner_id,canonical_url),
 unique(id,owner_id)
);

create table public.study_opportunity_scholarships (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null default auth.uid() references auth.users(id),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 opportunity_id uuid not null, scholarship_id uuid not null, unique(owner_id,opportunity_id,scholarship_id),
 unique(id,owner_id)
);

create table public.study_agent_tasks (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null default auth.uid() references auth.users(id),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 opportunity_id uuid not null,
 kind text not null check (kind in ('discovery','verification','professor_research','eligibility','funding','immigration','application_preparation','outreach_draft','deadline_monitor')),
 status text not null default 'queued' check (status in ('queued','running','succeeded','failed','cancelled')),
 inputs jsonb not null default '{}'::jsonb,
 idempotency_key uuid not null,
 attempts integer not null default 0 check (attempts between 0 and 5),
 max_attempts integer not null default 3 check (max_attempts between 1 and 5),
 available_at timestamptz not null default now(), lease_until timestamptz, lease_token uuid,
 unique(owner_id,idempotency_key), check ((status = 'running') = (lease_until is not null and lease_token is not null)),
 unique(id,owner_id)
);

create table public.study_agent_executions (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null default auth.uid() references auth.users(id),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 task_id uuid not null, attempt integer not null check (attempt > 0),
 status text not null check (status in ('running','succeeded','failed')),
 started_at timestamptz not null default now(), finished_at timestamptz,
 inputs jsonb not null default '{}'::jsonb, outputs jsonb, error_code text,
 model text, provider text, unique(owner_id,task_id,attempt),
 check ((status = 'running' and finished_at is null) or (status <> 'running' and finished_at is not null)),
 unique(id,owner_id)
);

create table public.study_execution_logs (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null default auth.uid() references auth.users(id),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 execution_id uuid not null, level text not null check (level in ('info','warn','error')), code text not null, metadata jsonb not null default '{}'::jsonb,
 unique(id,owner_id)
);

create table public.study_research_sources (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null default auth.uid() references auth.users(id),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 original_url text not null, canonical_url text not null, title text not null, published_at timestamptz, retrieved_at timestamptz not null default now(), verification_status text not null default 'unverified' check (verification_status in ('unverified','verified','stale','conflicting')), content_sha256 text check (content_sha256 ~ '^[0-9a-f]{64}$'), unique(owner_id,canonical_url,retrieved_at),
 unique(id,owner_id)
);

create table public.study_research_reports (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null default auth.uid() references auth.users(id),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 opportunity_id uuid not null, execution_id uuid, title text not null, summary text not null, schema_version text not null default '1.0',
 unique(id,owner_id)
);

create table public.study_research_findings (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null default auth.uid() references auth.users(id),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 report_id uuid not null, claim text not null, verification_status text not null default 'unverified' check (verification_status in ('unverified','verified','stale','conflicting')), verified_at timestamptz, check (verification_status <> 'verified' or verified_at is not null),
 unique(id,owner_id)
);

create table public.study_finding_sources (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null default auth.uid() references auth.users(id),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 finding_id uuid not null, source_id uuid not null, excerpt text, unique(owner_id,finding_id,source_id),
 unique(id,owner_id)
);

create table public.study_execution_sources (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null default auth.uid() references auth.users(id),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 execution_id uuid not null, source_id uuid not null, unique(owner_id,execution_id,source_id),
 unique(id,owner_id)
);

create table public.study_deadlines (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null default auth.uid() references auth.users(id),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 opportunity_id uuid not null, source_id uuid, kind text not null, due_at timestamptz not null, original_timezone text not null, original_text text not null, verification_status text not null default 'unverified' check (verification_status in ('unverified','verified','stale','conflicting')),
 unique(id,owner_id)
);

create table public.study_application_requirements (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null default auth.uid() references auth.users(id),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 opportunity_id uuid not null, source_id uuid, label text not null, required boolean not null default true, completed_at timestamptz, unique(owner_id,opportunity_id,label),
 unique(id,owner_id)
);

create table public.study_immigration_assessments (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null default auth.uid() references auth.users(id),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 opportunity_id uuid not null, report_id uuid, scenario text not null check (scenario in ('with_spouse','solo_then_spouse')), assessment text not null, eligibility text not null default 'unknown' check (eligibility in ('unknown','eligible','ineligible','conditional')), nationality text not null, assessed_at timestamptz not null default now(), review_after timestamptz, unique(owner_id,opportunity_id,scenario,assessed_at),
 unique(id,owner_id)
);

create table public.study_documents (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null default auth.uid() references auth.users(id),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 opportunity_id uuid, storage_path text not null, filename text not null, mime_type text not null, size_bytes bigint not null check (size_bytes between 1 and 10485760), sha256 text not null check (sha256 ~ '^[0-9a-f]{64}$'), version integer not null default 1 check (version > 0), unique(owner_id,storage_path), check (storage_path like owner_id::text || '/%'),
 unique(id,owner_id)
);

create table public.study_applications (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null default auth.uid() references auth.users(id),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 opportunity_id uuid not null, status text not null default 'draft' check (status in ('draft','ready','submitted','accepted','declined','withdrawn')), submitted_at timestamptz, external_reference text, unique(owner_id,opportunity_id), check (status <> 'submitted' or submitted_at is not null),
 unique(id,owner_id)
);

create table public.study_professor_contacts (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null default auth.uid() references auth.users(id),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 professor_id uuid not null, email text not null, source_id uuid, verified_at timestamptz, unique(owner_id,professor_id,email),
 unique(id,owner_id)
);

create table public.study_email_conversations (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null default auth.uid() references auth.users(id),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 professor_id uuid not null, provider_thread_id text, subject text not null, unique(owner_id,provider_thread_id),
 unique(id,owner_id)
);

create table public.study_email_messages (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null default auth.uid() references auth.users(id),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 conversation_id uuid not null, provider_message_id text, direction text not null check (direction in ('inbound','outbound','draft')), recipient text not null, body text not null, sent_at timestamptz, unique(owner_id,provider_message_id),
 unique(id,owner_id)
);

create table public.study_approvals (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null default auth.uid() references auth.users(id),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 opportunity_id uuid, action_type text not null check (action_type in ('send_email','submit_application','upload_document','payment','sign_declaration','accept_terms')),
 payload jsonb not null, payload_sha256 text not null check (payload_sha256 ~ '^[0-9a-f]{64}$'),
 status text not null default 'pending' check (status in ('pending','approved','rejected','consumed','expired')),
 decided_at timestamptz, expires_at timestamptz not null, consumed_at timestamptz,
 check (expires_at > created_at), check (status not in ('approved','rejected','consumed') or decided_at is not null),
 check ((status = 'consumed') = (consumed_at is not null)),
 unique(id,owner_id)
);

create table public.study_external_actions (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null default auth.uid() references auth.users(id),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 approval_id uuid not null, idempotency_key uuid not null, status text not null check (status in ('pending','executing','succeeded','failed','uncertain')), provider_reference text, executed_at timestamptz, unique(owner_id,approval_id), unique(owner_id,idempotency_key),
 unique(id,owner_id)
);

create table public.study_audit_events (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null default auth.uid() references auth.users(id),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 entity_table text not null, entity_id uuid not null, operation text not null check (operation in ('INSERT','UPDATE','DELETE')), actor_id uuid, changed_columns text[] not null default '{}',
 unique(id,owner_id)
);
alter table public.study_programmes add foreign key (university_id,owner_id) references public.study_universities(id,owner_id);
create index on public.study_programmes(owner_id,university_id);
alter table public.study_programme_scholarships add foreign key (programme_id,owner_id) references public.study_programmes(id,owner_id);
create index on public.study_programme_scholarships(owner_id,programme_id);
alter table public.study_programme_scholarships add foreign key (scholarship_id,owner_id) references public.study_scholarships(id,owner_id);
create index on public.study_programme_scholarships(owner_id,scholarship_id);
alter table public.study_laboratories add foreign key (university_id,owner_id) references public.study_universities(id,owner_id);
create index on public.study_laboratories(owner_id,university_id);
alter table public.study_professors add foreign key (university_id,owner_id) references public.study_universities(id,owner_id);
create index on public.study_professors(owner_id,university_id);
alter table public.study_professors add foreign key (laboratory_id,owner_id) references public.study_laboratories(id,owner_id);
create index on public.study_professors(owner_id,laboratory_id);
alter table public.study_recruitment_posts add foreign key (professor_id,owner_id) references public.study_professors(id,owner_id);
create index on public.study_recruitment_posts(owner_id,professor_id);
alter table public.study_recruitment_posts add foreign key (laboratory_id,owner_id) references public.study_laboratories(id,owner_id);
create index on public.study_recruitment_posts(owner_id,laboratory_id);
alter table public.study_opportunities add foreign key (programme_id,owner_id) references public.study_programmes(id,owner_id);
create index on public.study_opportunities(owner_id,programme_id);
alter table public.study_opportunities add foreign key (professor_id,owner_id) references public.study_professors(id,owner_id);
create index on public.study_opportunities(owner_id,professor_id);
alter table public.study_opportunities add foreign key (recruitment_post_id,owner_id) references public.study_recruitment_posts(id,owner_id);
create index on public.study_opportunities(owner_id,recruitment_post_id);
alter table public.study_opportunity_scholarships add foreign key (opportunity_id,owner_id) references public.study_opportunities(id,owner_id);
create index on public.study_opportunity_scholarships(owner_id,opportunity_id);
alter table public.study_opportunity_scholarships add foreign key (scholarship_id,owner_id) references public.study_scholarships(id,owner_id);
create index on public.study_opportunity_scholarships(owner_id,scholarship_id);
alter table public.study_agent_tasks add foreign key (opportunity_id,owner_id) references public.study_opportunities(id,owner_id);
create index on public.study_agent_tasks(owner_id,opportunity_id);
alter table public.study_agent_executions add foreign key (task_id,owner_id) references public.study_agent_tasks(id,owner_id);
create index on public.study_agent_executions(owner_id,task_id);
alter table public.study_execution_logs add foreign key (execution_id,owner_id) references public.study_agent_executions(id,owner_id);
create index on public.study_execution_logs(owner_id,execution_id);
alter table public.study_research_reports add foreign key (opportunity_id,owner_id) references public.study_opportunities(id,owner_id);
create index on public.study_research_reports(owner_id,opportunity_id);
alter table public.study_research_reports add foreign key (execution_id,owner_id) references public.study_agent_executions(id,owner_id);
create index on public.study_research_reports(owner_id,execution_id);
alter table public.study_research_findings add foreign key (report_id,owner_id) references public.study_research_reports(id,owner_id);
create index on public.study_research_findings(owner_id,report_id);
alter table public.study_finding_sources add foreign key (finding_id,owner_id) references public.study_research_findings(id,owner_id);
create index on public.study_finding_sources(owner_id,finding_id);
alter table public.study_finding_sources add foreign key (source_id,owner_id) references public.study_research_sources(id,owner_id);
create index on public.study_finding_sources(owner_id,source_id);
alter table public.study_execution_sources add foreign key (execution_id,owner_id) references public.study_agent_executions(id,owner_id);
create index on public.study_execution_sources(owner_id,execution_id);
alter table public.study_execution_sources add foreign key (source_id,owner_id) references public.study_research_sources(id,owner_id);
create index on public.study_execution_sources(owner_id,source_id);
alter table public.study_deadlines add foreign key (opportunity_id,owner_id) references public.study_opportunities(id,owner_id);
create index on public.study_deadlines(owner_id,opportunity_id);
alter table public.study_deadlines add foreign key (source_id,owner_id) references public.study_research_sources(id,owner_id);
create index on public.study_deadlines(owner_id,source_id);
alter table public.study_application_requirements add foreign key (opportunity_id,owner_id) references public.study_opportunities(id,owner_id);
create index on public.study_application_requirements(owner_id,opportunity_id);
alter table public.study_application_requirements add foreign key (source_id,owner_id) references public.study_research_sources(id,owner_id);
create index on public.study_application_requirements(owner_id,source_id);
alter table public.study_immigration_assessments add foreign key (opportunity_id,owner_id) references public.study_opportunities(id,owner_id);
create index on public.study_immigration_assessments(owner_id,opportunity_id);
alter table public.study_immigration_assessments add foreign key (report_id,owner_id) references public.study_research_reports(id,owner_id);
create index on public.study_immigration_assessments(owner_id,report_id);
alter table public.study_documents add foreign key (opportunity_id,owner_id) references public.study_opportunities(id,owner_id);
create index on public.study_documents(owner_id,opportunity_id);
alter table public.study_applications add foreign key (opportunity_id,owner_id) references public.study_opportunities(id,owner_id);
create index on public.study_applications(owner_id,opportunity_id);
alter table public.study_professor_contacts add foreign key (professor_id,owner_id) references public.study_professors(id,owner_id);
create index on public.study_professor_contacts(owner_id,professor_id);
alter table public.study_professor_contacts add foreign key (source_id,owner_id) references public.study_research_sources(id,owner_id);
create index on public.study_professor_contacts(owner_id,source_id);
alter table public.study_email_conversations add foreign key (professor_id,owner_id) references public.study_professors(id,owner_id);
create index on public.study_email_conversations(owner_id,professor_id);
alter table public.study_email_messages add foreign key (conversation_id,owner_id) references public.study_email_conversations(id,owner_id);
create index on public.study_email_messages(owner_id,conversation_id);
alter table public.study_approvals add foreign key (opportunity_id,owner_id) references public.study_opportunities(id,owner_id);
create index on public.study_approvals(owner_id,opportunity_id);
alter table public.study_external_actions add foreign key (approval_id,owner_id) references public.study_approvals(id,owner_id);
create index on public.study_external_actions(owner_id,approval_id);

create index on public.study_opportunities(owner_id,status,created_at desc);
create index on public.study_deadlines(owner_id,due_at);
create index on public.study_agent_tasks(status,available_at) where status = 'queued';
create index on public.study_audit_events(owner_id,created_at desc);
create function study_private.touch_row() returns trigger language plpgsql set search_path = '' as $$
begin
 if new.owner_id <> old.owner_id or new.id <> old.id or new.created_at <> old.created_at then
   raise exception 'Identity and creation timestamp are immutable';
 end if;
 new.updated_at = now();
 return new;
end; $$;
create function study_private.audit_row() returns trigger language plpgsql security definer set search_path = '' as $$
declare r record; changed text[];
begin
 if tg_op = 'DELETE' then r := old; else r := new; end if;
 if tg_op = 'UPDATE' then
   select array_agg(n.key) into changed from jsonb_each(to_jsonb(new)) n
   where n.value is distinct from to_jsonb(old)->n.key and n.key <> 'updated_at';
 end if;
 insert into public.study_audit_events(owner_id,entity_table,entity_id,operation,actor_id,changed_columns)
 values(r.owner_id,tg_table_name,r.id,tg_op,auth.uid(),coalesce(changed,'{}'));
 return r;
end; $$;
revoke all on function study_private.touch_row() from public;
revoke all on function study_private.audit_row() from public;

alter table public.study_universities enable row level security;
revoke all on public.study_universities from anon, authenticated;
grant select on public.study_universities to authenticated;
create policy owner_read on public.study_universities for select to authenticated
 using ((select public.study_is_owner()) and owner_id = (select auth.uid()));
create trigger touch before update on public.study_universities for each row execute function study_private.touch_row();
create trigger audit after insert or update or delete on public.study_universities for each row execute function study_private.audit_row();

alter table public.study_programmes enable row level security;
revoke all on public.study_programmes from anon, authenticated;
grant select on public.study_programmes to authenticated;
create policy owner_read on public.study_programmes for select to authenticated
 using ((select public.study_is_owner()) and owner_id = (select auth.uid()));
create trigger touch before update on public.study_programmes for each row execute function study_private.touch_row();
create trigger audit after insert or update or delete on public.study_programmes for each row execute function study_private.audit_row();

alter table public.study_scholarships enable row level security;
revoke all on public.study_scholarships from anon, authenticated;
grant select on public.study_scholarships to authenticated;
create policy owner_read on public.study_scholarships for select to authenticated
 using ((select public.study_is_owner()) and owner_id = (select auth.uid()));
create trigger touch before update on public.study_scholarships for each row execute function study_private.touch_row();
create trigger audit after insert or update or delete on public.study_scholarships for each row execute function study_private.audit_row();

alter table public.study_programme_scholarships enable row level security;
revoke all on public.study_programme_scholarships from anon, authenticated;
grant select on public.study_programme_scholarships to authenticated;
create policy owner_read on public.study_programme_scholarships for select to authenticated
 using ((select public.study_is_owner()) and owner_id = (select auth.uid()));
create trigger touch before update on public.study_programme_scholarships for each row execute function study_private.touch_row();
create trigger audit after insert or update or delete on public.study_programme_scholarships for each row execute function study_private.audit_row();

alter table public.study_laboratories enable row level security;
revoke all on public.study_laboratories from anon, authenticated;
grant select on public.study_laboratories to authenticated;
create policy owner_read on public.study_laboratories for select to authenticated
 using ((select public.study_is_owner()) and owner_id = (select auth.uid()));
create trigger touch before update on public.study_laboratories for each row execute function study_private.touch_row();
create trigger audit after insert or update or delete on public.study_laboratories for each row execute function study_private.audit_row();

alter table public.study_professors enable row level security;
revoke all on public.study_professors from anon, authenticated;
grant select on public.study_professors to authenticated;
create policy owner_read on public.study_professors for select to authenticated
 using ((select public.study_is_owner()) and owner_id = (select auth.uid()));
create trigger touch before update on public.study_professors for each row execute function study_private.touch_row();
create trigger audit after insert or update or delete on public.study_professors for each row execute function study_private.audit_row();

alter table public.study_recruitment_posts enable row level security;
revoke all on public.study_recruitment_posts from anon, authenticated;
grant select on public.study_recruitment_posts to authenticated;
create policy owner_read on public.study_recruitment_posts for select to authenticated
 using ((select public.study_is_owner()) and owner_id = (select auth.uid()));
create trigger touch before update on public.study_recruitment_posts for each row execute function study_private.touch_row();
create trigger audit after insert or update or delete on public.study_recruitment_posts for each row execute function study_private.audit_row();

alter table public.study_opportunities enable row level security;
revoke all on public.study_opportunities from anon, authenticated;
grant select on public.study_opportunities to authenticated;
create policy owner_read on public.study_opportunities for select to authenticated
 using ((select public.study_is_owner()) and owner_id = (select auth.uid()));
create trigger touch before update on public.study_opportunities for each row execute function study_private.touch_row();
create trigger audit after insert or update or delete on public.study_opportunities for each row execute function study_private.audit_row();

alter table public.study_opportunity_scholarships enable row level security;
revoke all on public.study_opportunity_scholarships from anon, authenticated;
grant select on public.study_opportunity_scholarships to authenticated;
create policy owner_read on public.study_opportunity_scholarships for select to authenticated
 using ((select public.study_is_owner()) and owner_id = (select auth.uid()));
create trigger touch before update on public.study_opportunity_scholarships for each row execute function study_private.touch_row();
create trigger audit after insert or update or delete on public.study_opportunity_scholarships for each row execute function study_private.audit_row();

alter table public.study_agent_tasks enable row level security;
revoke all on public.study_agent_tasks from anon, authenticated;
grant select on public.study_agent_tasks to authenticated;
create policy owner_read on public.study_agent_tasks for select to authenticated
 using ((select public.study_is_owner()) and owner_id = (select auth.uid()));
create trigger touch before update on public.study_agent_tasks for each row execute function study_private.touch_row();
create trigger audit after insert or update or delete on public.study_agent_tasks for each row execute function study_private.audit_row();

alter table public.study_agent_executions enable row level security;
revoke all on public.study_agent_executions from anon, authenticated;
grant select on public.study_agent_executions to authenticated;
create policy owner_read on public.study_agent_executions for select to authenticated
 using ((select public.study_is_owner()) and owner_id = (select auth.uid()));
create trigger touch before update on public.study_agent_executions for each row execute function study_private.touch_row();
create trigger audit after insert or update or delete on public.study_agent_executions for each row execute function study_private.audit_row();

alter table public.study_execution_logs enable row level security;
revoke all on public.study_execution_logs from anon, authenticated;
grant select on public.study_execution_logs to authenticated;
create policy owner_read on public.study_execution_logs for select to authenticated
 using ((select public.study_is_owner()) and owner_id = (select auth.uid()));
create trigger touch before update on public.study_execution_logs for each row execute function study_private.touch_row();
create trigger audit after insert or update or delete on public.study_execution_logs for each row execute function study_private.audit_row();

alter table public.study_research_sources enable row level security;
revoke all on public.study_research_sources from anon, authenticated;
grant select on public.study_research_sources to authenticated;
create policy owner_read on public.study_research_sources for select to authenticated
 using ((select public.study_is_owner()) and owner_id = (select auth.uid()));
create trigger touch before update on public.study_research_sources for each row execute function study_private.touch_row();
create trigger audit after insert or update or delete on public.study_research_sources for each row execute function study_private.audit_row();

alter table public.study_research_reports enable row level security;
revoke all on public.study_research_reports from anon, authenticated;
grant select on public.study_research_reports to authenticated;
create policy owner_read on public.study_research_reports for select to authenticated
 using ((select public.study_is_owner()) and owner_id = (select auth.uid()));
create trigger touch before update on public.study_research_reports for each row execute function study_private.touch_row();
create trigger audit after insert or update or delete on public.study_research_reports for each row execute function study_private.audit_row();

alter table public.study_research_findings enable row level security;
revoke all on public.study_research_findings from anon, authenticated;
grant select on public.study_research_findings to authenticated;
create policy owner_read on public.study_research_findings for select to authenticated
 using ((select public.study_is_owner()) and owner_id = (select auth.uid()));
create trigger touch before update on public.study_research_findings for each row execute function study_private.touch_row();
create trigger audit after insert or update or delete on public.study_research_findings for each row execute function study_private.audit_row();

alter table public.study_finding_sources enable row level security;
revoke all on public.study_finding_sources from anon, authenticated;
grant select on public.study_finding_sources to authenticated;
create policy owner_read on public.study_finding_sources for select to authenticated
 using ((select public.study_is_owner()) and owner_id = (select auth.uid()));
create trigger touch before update on public.study_finding_sources for each row execute function study_private.touch_row();
create trigger audit after insert or update or delete on public.study_finding_sources for each row execute function study_private.audit_row();

alter table public.study_execution_sources enable row level security;
revoke all on public.study_execution_sources from anon, authenticated;
grant select on public.study_execution_sources to authenticated;
create policy owner_read on public.study_execution_sources for select to authenticated
 using ((select public.study_is_owner()) and owner_id = (select auth.uid()));
create trigger touch before update on public.study_execution_sources for each row execute function study_private.touch_row();
create trigger audit after insert or update or delete on public.study_execution_sources for each row execute function study_private.audit_row();

alter table public.study_deadlines enable row level security;
revoke all on public.study_deadlines from anon, authenticated;
grant select on public.study_deadlines to authenticated;
create policy owner_read on public.study_deadlines for select to authenticated
 using ((select public.study_is_owner()) and owner_id = (select auth.uid()));
create trigger touch before update on public.study_deadlines for each row execute function study_private.touch_row();
create trigger audit after insert or update or delete on public.study_deadlines for each row execute function study_private.audit_row();

alter table public.study_application_requirements enable row level security;
revoke all on public.study_application_requirements from anon, authenticated;
grant select on public.study_application_requirements to authenticated;
create policy owner_read on public.study_application_requirements for select to authenticated
 using ((select public.study_is_owner()) and owner_id = (select auth.uid()));
create trigger touch before update on public.study_application_requirements for each row execute function study_private.touch_row();
create trigger audit after insert or update or delete on public.study_application_requirements for each row execute function study_private.audit_row();

alter table public.study_immigration_assessments enable row level security;
revoke all on public.study_immigration_assessments from anon, authenticated;
grant select on public.study_immigration_assessments to authenticated;
create policy owner_read on public.study_immigration_assessments for select to authenticated
 using ((select public.study_is_owner()) and owner_id = (select auth.uid()));
create trigger touch before update on public.study_immigration_assessments for each row execute function study_private.touch_row();
create trigger audit after insert or update or delete on public.study_immigration_assessments for each row execute function study_private.audit_row();

alter table public.study_documents enable row level security;
revoke all on public.study_documents from anon, authenticated;
grant select on public.study_documents to authenticated;
create policy owner_read on public.study_documents for select to authenticated
 using ((select public.study_is_owner()) and owner_id = (select auth.uid()));
create trigger touch before update on public.study_documents for each row execute function study_private.touch_row();
create trigger audit after insert or update or delete on public.study_documents for each row execute function study_private.audit_row();

alter table public.study_applications enable row level security;
revoke all on public.study_applications from anon, authenticated;
grant select on public.study_applications to authenticated;
create policy owner_read on public.study_applications for select to authenticated
 using ((select public.study_is_owner()) and owner_id = (select auth.uid()));
create trigger touch before update on public.study_applications for each row execute function study_private.touch_row();
create trigger audit after insert or update or delete on public.study_applications for each row execute function study_private.audit_row();

alter table public.study_professor_contacts enable row level security;
revoke all on public.study_professor_contacts from anon, authenticated;
grant select on public.study_professor_contacts to authenticated;
create policy owner_read on public.study_professor_contacts for select to authenticated
 using ((select public.study_is_owner()) and owner_id = (select auth.uid()));
create trigger touch before update on public.study_professor_contacts for each row execute function study_private.touch_row();
create trigger audit after insert or update or delete on public.study_professor_contacts for each row execute function study_private.audit_row();

alter table public.study_email_conversations enable row level security;
revoke all on public.study_email_conversations from anon, authenticated;
grant select on public.study_email_conversations to authenticated;
create policy owner_read on public.study_email_conversations for select to authenticated
 using ((select public.study_is_owner()) and owner_id = (select auth.uid()));
create trigger touch before update on public.study_email_conversations for each row execute function study_private.touch_row();
create trigger audit after insert or update or delete on public.study_email_conversations for each row execute function study_private.audit_row();

alter table public.study_email_messages enable row level security;
revoke all on public.study_email_messages from anon, authenticated;
grant select on public.study_email_messages to authenticated;
create policy owner_read on public.study_email_messages for select to authenticated
 using ((select public.study_is_owner()) and owner_id = (select auth.uid()));
create trigger touch before update on public.study_email_messages for each row execute function study_private.touch_row();
create trigger audit after insert or update or delete on public.study_email_messages for each row execute function study_private.audit_row();

alter table public.study_approvals enable row level security;
revoke all on public.study_approvals from anon, authenticated;
grant select on public.study_approvals to authenticated;
create policy owner_read on public.study_approvals for select to authenticated
 using ((select public.study_is_owner()) and owner_id = (select auth.uid()));
create trigger touch before update on public.study_approvals for each row execute function study_private.touch_row();
create trigger audit after insert or update or delete on public.study_approvals for each row execute function study_private.audit_row();

alter table public.study_external_actions enable row level security;
revoke all on public.study_external_actions from anon, authenticated;
grant select on public.study_external_actions to authenticated;
create policy owner_read on public.study_external_actions for select to authenticated
 using ((select public.study_is_owner()) and owner_id = (select auth.uid()));
create trigger touch before update on public.study_external_actions for each row execute function study_private.touch_row();
create trigger audit after insert or update or delete on public.study_external_actions for each row execute function study_private.audit_row();

alter table public.study_audit_events enable row level security;
revoke all on public.study_audit_events from anon, authenticated;
grant select on public.study_audit_events to authenticated;
create policy owner_read on public.study_audit_events for select to authenticated
 using ((select public.study_is_owner()) and owner_id = (select auth.uid()));

-- Only the implemented mutations are granted. Verification cannot be self-promoted.
grant insert(title,kind,country,official_url,canonical_url,funding,notes,owner_id) on public.study_opportunities to authenticated;
grant update(status) on public.study_opportunities to authenticated;
create policy owner_insert on public.study_opportunities for insert to authenticated
 with check ((select public.study_is_owner()) and owner_id = (select auth.uid()) and verification_status = 'unverified' and status = 'discovered');
create policy owner_update on public.study_opportunities for update to authenticated
 using ((select public.study_is_owner()) and owner_id = (select auth.uid()))
 with check ((select public.study_is_owner()) and owner_id = (select auth.uid()));
grant insert(opportunity_id,kind,idempotency_key,owner_id,inputs) on public.study_agent_tasks to authenticated;
create policy owner_enqueue on public.study_agent_tasks for insert to authenticated
 with check ((select public.study_is_owner()) and owner_id = (select auth.uid()) and status = 'queued' and attempts = 0);
-- Approvals, executions and external actions have no client mutation grants.
-- A future worker must use narrow RPCs with leases; no worker credentials belong in this web app.
commit;
