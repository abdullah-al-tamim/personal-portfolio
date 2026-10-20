-- Additive module; no private applicant data. CLI unavailable in authoring environment.
begin;
create table public.study_document_registry (
 id uuid primary key default gen_random_uuid(), owner_id uuid not null references auth.users(id),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 type_key text not null check(type_key ~ '^[a-z_]{2,40}$'), title text not null check(length(title) between 2 and 160),
 category text not null default 'Other', subject text not null default 'self' check(subject in ('self','spouse','sponsor')),
 acquisition text not null default 'not_assessed' check(acquisition in ('not_assessed','not_requested','request_prepared','requested','processing','ready_for_collection','collected','unavailable','not_required')),
 digital text not null default 'not_assessed' check(digital in ('not_assessed','no_copy','scan_needed','uploaded','quality_review','verified','revision_required')),
 attestation text not null default 'not_assessed' check(attestation in ('not_assessed','not_required','required','awaiting_prerequisites','ready_for_online_preparation','preparing','awaiting_approval','approved','submitted','processing','completed','rejected','manual_required')),
 translation text not null default 'not_assessed' check(translation in ('not_assessed','not_required','required','in_progress','completed')),
 readiness text not null default 'not_assessed' check(readiness in ('not_assessed','missing','in_progress','ready','expired','needs_updating','not_applicable')),
 issuer text not null default '', issue_date date, expiry_date date, due_date date,
 destination text not null default '', process_url text not null default '' check(process_url='' or process_url ~ '^https://'),
 notes text not null default '' check(length(notes)<=4000), next_action text not null default '', revision integer not null default 0,
 archived_at timestamptz, unique(id,owner_id), unique(owner_id,type_key,subject),
 check(issue_date is null or expiry_date is null or expiry_date>=issue_date)
);
alter table public.study_documents add column registry_id uuid;
alter table public.study_documents add column version_kind text not null default 'original' check(version_kind in ('original','scan','translation','attested','draft'));
alter table public.study_documents add foreign key(registry_id,owner_id) references public.study_document_registry(id,owner_id);
create unique index study_document_version_unique on public.study_documents(owner_id,registry_id,version) where registry_id is not null;
create unique index study_document_content_unique on public.study_documents(owner_id,registry_id,sha256) where registry_id is not null;
create table public.study_document_requirements (
 id uuid primary key default gen_random_uuid(),owner_id uuid not null references auth.users(id),created_at timestamptz not null default now(),updated_at timestamptz not null default now(),
 opportunity_id uuid not null,document_id uuid not null,label text not null check(length(label) between 2 and 300),
 stage text not null check(stage in ('application','scholarship','conditional_admission','admission','visa','enrolment','dependent_visa')),
 classification text not null default 'unverified' check(classification in ('mandatory','conditional','optional','not_required','unverified')),
 source_url text check(source_url ~ '^https://'),verified_at timestamptz,freshness_days integer check(freshness_days between 1 and 3650),
 unique(id,owner_id),unique(owner_id,opportunity_id,document_id,stage),
 foreign key(opportunity_id,owner_id) references public.study_opportunities(id,owner_id),
 foreign key(document_id,owner_id) references public.study_document_registry(id,owner_id),
 check(classification not in ('mandatory','not_required') or (source_url is not null and verified_at is not null))
);
create table public.study_document_dependencies (
 id uuid primary key default gen_random_uuid(),owner_id uuid not null references auth.users(id),created_at timestamptz not null default now(),updated_at timestamptz not null default now(),
 document_id uuid not null,prerequisite_id uuid not null,unique(id,owner_id),unique(owner_id,document_id,prerequisite_id),check(document_id<>prerequisite_id),
 foreign key(document_id,owner_id) references public.study_document_registry(id,owner_id),foreign key(prerequisite_id,owner_id) references public.study_document_registry(id,owner_id)
);
create table public.study_document_jobs (
 id uuid primary key default gen_random_uuid(),owner_id uuid not null references auth.users(id),created_at timestamptz not null default now(),updated_at timestamptz not null default now(),
 document_id uuid not null,document_revision integer not null,
 status text not null default 'queued' check(status in ('queued','running','waiting_approval','waiting_manual','completed','failed','paused','cancelled')),
 attempts integer not null default 0 check(attempts between 0 and 3),available_at timestamptz not null default now(),
 lease_token uuid,lease_until timestamptz,plan jsonb,error_code text,
 unique(id,owner_id),unique(owner_id,document_id,document_revision),
 foreign key(document_id,owner_id) references public.study_document_registry(id,owner_id),
 check((status='running')=(lease_token is not null and lease_until is not null))
);
create table public.study_document_runs (
 id uuid primary key default gen_random_uuid(),owner_id uuid not null references auth.users(id),created_at timestamptz not null default now(),updated_at timestamptz not null default now(),
 job_id uuid not null,attempt integer not null,finished_at timestamptz,output jsonb,error_code text,
 unique(id,owner_id),unique(owner_id,job_id,attempt),foreign key(job_id,owner_id) references public.study_document_jobs(id,owner_id)
);
create table public.study_document_reviews (
 id uuid primary key default gen_random_uuid(),owner_id uuid not null references auth.users(id),created_at timestamptz not null default now(),updated_at timestamptz not null default now(),
 job_id uuid not null,document_revision integer not null,payload jsonb not null,
 status text not null default 'pending' check(status in ('pending','approved','rejected','expired')),decided_at timestamptz,expires_at timestamptz not null default(now()+interval '7 days'),
 unique(id,owner_id),unique(owner_id,job_id),foreign key(job_id,owner_id) references public.study_document_jobs(id,owner_id)
);
create table public.study_document_events (
 id uuid primary key default gen_random_uuid(),owner_id uuid not null references auth.users(id),created_at timestamptz not null default now(),updated_at timestamptz not null default now(),
 document_id uuid not null,actor_id uuid,axis text not null,from_value text,to_value text,unique(id,owner_id),foreign key(document_id,owner_id) references public.study_document_registry(id,owner_id)
);
-- Session reads only; mutations are constrained transactional commands below.
do $$ declare t text; begin
 foreach t in array array['study_document_registry','study_document_requirements','study_document_dependencies','study_document_jobs','study_document_runs','study_document_reviews','study_document_events'] loop
 execute format('alter table public.%I enable row level security',t);
 execute format('revoke all on public.%I from public,anon,authenticated',t);
 execute format('grant select on public.%I to authenticated',t);
 execute format('create policy owner_read on public.%I for select to authenticated using ((select public.study_is_owner()) and owner_id=(select auth.uid()))',t);
 execute format('create index on public.%I(owner_id)',t);
 execute format('create trigger touch before update on public.%I for each row execute function study_private.touch_row()',t);
 execute format('create trigger audit after insert or update or delete on public.%I for each row execute function study_private.audit_row()',t);
 end loop;
end $$;
create index on public.study_document_jobs(owner_id,status,available_at);
create index on public.study_document_requirements(owner_id,opportunity_id);
create index on public.study_documents(owner_id,registry_id);
-- Transactional event => durable, deduplicated job. No remote side effect in a trigger.
create function study_private.queue_document_preparation() returns trigger language plpgsql security definer set search_path='' as $$
begin
 if new.attestation='ready_for_online_preparation' and old.attestation is distinct from new.attestation then
 insert into public.study_document_jobs(owner_id,document_id,document_revision) values(new.owner_id,new.id,new.revision) on conflict do nothing;
 end if;
 return new;
end $$;
revoke all on function study_private.queue_document_preparation() from public,anon,authenticated;
create trigger prepare_document after update on public.study_document_registry for each row execute function study_private.queue_document_preparation();
-- Narrow owner-only command boundary. No caller-supplied owner, SQL, external action or arbitrary fetch.
create function public.study_document_command(command text,p jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare own uuid:=auth.uid(); d public.study_document_registry; result uuid; axis text; target text; old_value text; j public.study_document_jobs; review public.study_document_reviews; cycle boolean;
begin
 if own is null or not public.study_is_owner() then raise exception 'Owner access required'; end if;
 if octet_length(p::text)>30000 then raise exception 'Input too large'; end if;
 if command='create' then
 insert into public.study_document_registry(owner_id,title,type_key,category,subject) values(own,p->>'title',p->>'type_key',coalesce(p->>'category','Other'),coalesce(p->>'subject','self')) on conflict(owner_id,type_key,subject) do nothing returning id into result;
 if result is null then select id into result from public.study_document_registry where owner_id=own and type_key=p->>'type_key' and subject=coalesce(p->>'subject','self'); end if;
 return jsonb_build_object('id',result);
 end if;
 if command in ('job_control','review') then
 if command='review' then
 select * into review from public.study_document_reviews where id=(p->>'id')::uuid and owner_id=own for update;
 if not found or review.status<>'pending' or review.expires_at<=now() then raise exception 'Review expired or already decided'; end if;
 select * into j from public.study_document_jobs where id=review.job_id and owner_id=own for update;
 select * into d from public.study_document_registry where id=j.document_id and owner_id=own for update;
 if d.revision<>review.document_revision or j.status<>'waiting_approval' then raise exception 'Document changed; generate a new plan'; end if;
 if p->>'decision' not in ('approved','rejected') then raise exception 'Invalid review'; end if;
 update public.study_document_reviews set status=p->>'decision',decided_at=now() where id=review.id;
 update public.study_document_jobs set status=case when p->>'decision'='approved' then 'waiting_manual' else 'cancelled' end where id=j.id;
 -- Approval is INTERNAL PLAN REVIEW ONLY; cannot authorize or execute a government submission.
 return jsonb_build_object('status','saved');
 end if;
 select * into j from public.study_document_jobs where id=(p->>'id')::uuid and owner_id=own for update;
 if not found then raise exception 'Job not found'; end if;
 target:=p->>'target';
 if not ((target='paused' and j.status='queued') or (target='queued' and j.status in ('paused','failed') and j.attempts<3) or (target='cancelled' and j.status not in ('completed','cancelled'))) then raise exception 'Invalid job transition'; end if;
 update public.study_document_jobs set status=target,lease_token=null,lease_until=null where id=j.id;
 return jsonb_build_object('status',target);
 end if;
 select * into d from public.study_document_registry where id=(p->>'id')::uuid and owner_id=own for update;
 if not found or d.archived_at is not null then raise exception 'Document not found'; end if;
 if command='metadata' then
 update public.study_document_registry set issuer=coalesce(p->>'issuer',''),issue_date=nullif(p->>'issue_date','')::date,expiry_date=nullif(p->>'expiry_date','')::date,due_date=nullif(p->>'due_date','')::date,notes=coalesce(p->>'notes',''),destination=coalesce(p->>'destination',''),process_url=coalesce(p->>'process_url',''),next_action=coalesce(p->>'next_action',''),revision=revision+1 where id=d.id;
 elsif command='transition' then
 if d.revision<>(p->>'revision')::integer then raise exception 'Document changed; refresh before retrying'; end if;
 axis:=p->>'axis'; target:=p->>'target';
 if axis not in ('acquisition','digital','attestation','translation','readiness') then raise exception 'Invalid workflow'; end if;
 old_value:=to_jsonb(d)->>axis;
 if old_value=target then return jsonb_build_object('status','unchanged'); end if;
 if axis='digital' and target in ('uploaded','quality_review','verified') and not exists(select 1 from public.study_documents where registry_id=d.id and owner_id=own) then raise exception 'Upload a file first'; end if;
 if axis='attestation' and target in ('preparing','awaiting_approval','approved','submitted','processing','completed') then raise exception 'External processing states require a verified service integration; currently unavailable'; end if;
 if axis='attestation' and target='ready_for_online_preparation' then
 if d.digital<>'verified' or d.destination='' or d.process_url='' then raise exception 'Review the scan, destination and official process URL first'; end if;
 if exists(select 1 from public.study_document_dependencies dep join public.study_document_registry pre on pre.id=dep.prerequisite_id and pre.owner_id=dep.owner_id where dep.document_id=d.id and dep.owner_id=own and (pre.readiness<>'ready' or pre.expiry_date<current_date)) then raise exception 'Prerequisites are not ready'; end if;
 end if;
 if axis='readiness' and target='ready' and (d.digital<>'verified' or d.expiry_date<current_date or d.translation in ('required','in_progress') or d.attestation not in ('not_required','completed')) then raise exception 'Verified copy, valid expiry, translation and attestation assessment required'; end if;
 execute format('update public.study_document_registry set %I=$1,revision=revision+1 where id=$2',axis) using target,d.id;
 insert into public.study_document_events(owner_id,document_id,actor_id,axis,from_value,to_value) values(own,d.id,own,axis,old_value,target);
 elsif command='file' then
 if not exists(select 1 from storage.objects where bucket_id='study-documents' and name=p->>'path') or p->>'path' not like own::text||'/'||d.id::text||'/%' then raise exception 'Private upload not found'; end if;
 insert into public.study_documents(owner_id,registry_id,storage_path,filename,mime_type,size_bytes,sha256,version,version_kind) values(own,d.id,p->>'path',p->>'filename',p->>'mime',(p->>'size')::bigint,p->>'sha256',coalesce((select max(version)+1 from public.study_documents where registry_id=d.id and owner_id=own),1),coalesce(p->>'version_kind','original')) on conflict do nothing returning id into result;
 update public.study_document_registry set digital='quality_review',readiness=case when readiness='ready' then 'needs_updating' else readiness end,revision=revision+1 where id=d.id;
 elsif command='link' then
 insert into public.study_document_requirements(owner_id,opportunity_id,document_id,label,stage,classification,source_url,verified_at,freshness_days) values(own,(p->>'opportunity_id')::uuid,d.id,p->>'label',p->>'stage',p->>'classification',nullif(p->>'source_url',''),case when p->>'verified'='true' then now() else null end,nullif(p->>'freshness_days','')::integer) on conflict(owner_id,opportunity_id,document_id,stage) do nothing;
 elsif command='dependency' then
 with recursive chain(id) as (select (p->>'prerequisite_id')::uuid union select dep.prerequisite_id from public.study_document_dependencies dep join chain c on dep.document_id=c.id where dep.owner_id=own) select exists(select 1 from chain where id=d.id) into cycle;
 if cycle then raise exception 'Dependency cycle'; end if;
 insert into public.study_document_dependencies(owner_id,document_id,prerequisite_id) values(own,d.id,(p->>'prerequisite_id')::uuid) on conflict do nothing;
 elsif command='archive' then
 update public.study_document_registry set archived_at=now(),revision=revision+1 where id=d.id;
 update public.study_document_jobs set status='cancelled',lease_token=null,lease_until=null where document_id=d.id and status not in ('completed','cancelled');
 else raise exception 'Unsupported command'; end if;
 return jsonb_build_object('id',coalesce(result,d.id));
end $$;
revoke all on function public.study_document_command(text,jsonb) from public,anon,authenticated;
grant execute on function public.study_document_command(text,jsonb) to authenticated;
-- Actual internal processor: transactional row locking, persisted attempts/results and bounded retries.
-- Deliberately no HTTP, email, browser, model or government submission tools.
create function public.study_document_process_next() returns jsonb language plpgsql security definer set search_path='' as $$
declare own uuid:=auth.uid(); j public.study_document_jobs; d public.study_document_registry; run_id uuid; v_plan jsonb; final_status text;
begin
 if own is null or not public.study_is_owner() then raise exception 'Owner access required'; end if;
 select * into j from public.study_document_jobs where owner_id=own and status='queued' and attempts<3 and available_at<=now() order by created_at for update skip locked limit 1;
 if not found then return jsonb_build_object('status','idle'); end if;
 select * into d from public.study_document_registry where id=j.document_id and owner_id=own for update;
 update public.study_document_jobs set status='running',attempts=attempts+1,lease_token=gen_random_uuid(),lease_until=now()+interval '2 minutes' where id=j.id;
 insert into public.study_document_runs(owner_id,job_id,attempt) values(own,j.id,j.attempts+1) returning id into run_id;
 begin
 final_status:='waiting_approval';
 if d.archived_at is not null or d.revision<>j.document_revision or d.digital<>'verified' then final_status:='waiting_manual'; end if;
 v_plan:=jsonb_build_object('schema_version','1.0','engine','deterministic-readiness-v1','scope','Internal preparation only','document_revision',d.revision,'destination',d.destination,'official_process_url',d.process_url,'checks',jsonb_build_array('Confirm document type and issuing authority match the selected service','Recheck current official fees, attachment limits and destination recognition','Review all pages for clarity and completeness; no OCR or authenticity certification performed','Obtain separate explicit approval before sending any document, accepting terms or paying'),'blockers',case when final_status='waiting_manual' then jsonb_build_array('Document changed or scan review is incomplete; generate a fresh plan') else jsonb_build_array('Live external service adapter is not connected','Current official procedure must be checked before external use') end,'external_submission_performed',false);
 update public.study_document_jobs set status=final_status,plan=v_plan,lease_token=null,lease_until=null,error_code=null where id=j.id;
 update public.study_document_runs set finished_at=now(),output=v_plan where id=run_id;
 if final_status='waiting_approval' then insert into public.study_document_reviews(owner_id,job_id,document_revision,payload) values(own,j.id,d.revision,v_plan) on conflict do nothing; end if;
 exception when others then
 update public.study_document_jobs set status='failed',error_code='INTERNAL_PLAN_FAILED',lease_token=null,lease_until=null,available_at=now()+interval '1 minute' where id=j.id;
 update public.study_document_runs set finished_at=now(),error_code='INTERNAL_PLAN_FAILED' where id=run_id;
 return jsonb_build_object('status','failed','id',j.id);
 end;
 return jsonb_build_object('status',final_status,'id',j.id);
end $$;
revoke all on function public.study_document_process_next() from public,anon,authenticated;
grant execute on function public.study_document_process_next() to authenticated;
-- Private immutable uploads. No overwrite grant. Metadata requires registered owner records.
update storage.buckets set allowed_mime_types=array['application/pdf','image/jpeg','image/png'],file_size_limit=3145728 where id='study-documents';
create policy study_document_upload on storage.objects for insert to authenticated with check(bucket_id='study-documents' and (select public.study_is_owner()) and (storage.foldername(name))[1]=(select auth.uid())::text and exists(select 1 from public.study_document_registry d where d.owner_id=(select auth.uid()) and d.id::text=(storage.foldername(name))[2] and d.archived_at is null));
commit;
