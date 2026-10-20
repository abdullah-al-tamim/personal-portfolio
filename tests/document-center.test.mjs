import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';
import {inspectFile} from '../src/lib/study-hub/documents/validation.mjs';
import {readiness} from '../src/lib/study-hub/documents/catalog.mjs';
test('uploads reject disguised files and readiness excludes unverified requirements',()=>{
 assert.throws(()=>inspectFile(Buffer.from('<script>bad</script>'),'scan.pdf','application/pdf'));
 assert.equal(inspectFile(Buffer.from('%PDF-1.7\n'),'scan.pdf','application/pdf').extension,'pdf');
 assert.equal(readiness([{classification:'unverified'}],[]).percent,null);
 assert.equal(readiness([{classification:'mandatory',source_url:'https://example.edu',verified_at:'2026-10-20',document_id:'d'}],[{id:'d',readiness:'ready',expiry_date:'2020-01-01'}]).ready,0);
});
test('document workflow isolates owners, queues once, processes plans and prevents stale approvals',async()=>{
 const db=new PGlite();const owner='00000000-0000-4000-8000-000000000001',other='00000000-0000-4000-8000-000000000002';
 try{
 await db.exec(`create role anon;create role authenticated;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;grant usage on schema auth to authenticated,anon;create schema storage;create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);create table storage.objects(id uuid default gen_random_uuid(),bucket_id text,name text);alter table storage.objects enable row level security;grant usage on schema storage to authenticated,anon;grant select,insert on storage.objects to authenticated,anon;create function storage.foldername(name text) returns text[] language sql as $$select string_to_array(name,'/')$$;`);
 for(const name of ['202610190001_study_hub.sql','202610190002_private_storage.sql','202610200001_revoke_anonymous_owner_check.sql','202610200002_document_center.sql'])await db.exec(await readFile(new URL('../supabase/migrations/'+name,import.meta.url),'utf8'));
 await db.exec(`insert into auth.users values('${owner}'),('${other}');insert into study_private.approved_users(user_id) values('${owner}');set role authenticated;select set_config('request.jwt.claim.sub','${owner}',false);`);
 const cmd=async(command,p)=>(await db.query('select public.study_document_command($1,$2::jsonb) as result',[command,JSON.stringify(p)])).rows[0].result;
 const {id}=await cmd('create',{title:'Synthetic certificate',type_key:'degree',subject:'self'});
 assert.equal((await cmd('create',{title:'Duplicate',type_key:'degree',subject:'self'})).id,id);
 await assert.rejects(cmd('transition',{id,axis:'digital',target:'verified',revision:0}),/Upload/);
 await db.exec(`insert into storage.objects(bucket_id,name) values('study-documents','${owner}/${id}/sample.pdf')`);
 await cmd('file',{id,path:`${owner}/${id}/sample.pdf`,filename:'sample.pdf',mime:'application/pdf',size:100,sha256:'a'.repeat(64)});
 await cmd('transition',{id,axis:'digital',target:'verified',revision:1});
 await cmd('metadata',{id,destination:'Example',process_url:'https://www.mygov.bd/'});
 await cmd('transition',{id,axis:'attestation',target:'ready_for_online_preparation',revision:3});
 await cmd('transition',{id,axis:'attestation',target:'ready_for_online_preparation',revision:4});
 assert.equal((await db.query('select count(*)::int n from study_document_jobs')).rows[0].n,1);
 const result=(await db.query('select public.study_document_process_next() as result')).rows[0].result;
 assert.equal(result.status,'waiting_approval');
 assert.equal((await db.query('select public.study_document_process_next() as result')).rows[0].result.status,'idle');
 const review=(await db.query('select id from study_document_reviews')).rows[0];
 await cmd('review',{id:review.id,decision:'approved'});
 assert.equal((await db.query('select status from study_document_jobs')).rows[0].status,'waiting_manual');
 await assert.rejects(cmd('review',{id:review.id,decision:'approved'}),/already decided/);
 await assert.rejects(cmd('transition',{id,axis:'attestation',target:'submitted',revision:4}),/External processing/);
 await db.exec(`select set_config('request.jwt.claim.sub','${other}',false)`);
 assert.equal((await db.query('select * from study_document_registry')).rows.length,0);
 await assert.rejects(cmd('create',{title:'Attack',type_key:'degree'}),/Owner access/);
 await db.exec('reset role;set role anon');
 await assert.rejects(db.query('select public.study_document_process_next()'),/permission denied/);
 }finally{await db.close();}
});
