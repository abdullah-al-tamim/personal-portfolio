import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
const owner = "00000000-0000-4000-8000-000000000001";
const other = "00000000-0000-4000-8000-000000000002";
const opportunity = "10000000-0000-4000-8000-000000000001";
test("Postgres migrations enforce isolation, immutability, queue permissions and private storage", async () => {
  const db = new PGlite();
  try {
    await db.exec(
      `create role anon; create role authenticated; create schema auth; create table auth.users(id uuid primary key); create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$; grant usage on schema auth to authenticated,anon; create schema storage; create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]); create table storage.objects(id uuid default gen_random_uuid(),bucket_id text,name text); alter table storage.objects enable row level security; grant usage on schema storage to authenticated,anon; grant select,insert on storage.objects to authenticated,anon; create function storage.foldername(name text) returns text[] language sql as $$ select string_to_array(name,'/') $$;`,
    );
    for (const file of [
      "202610190001_study_hub.sql",
      "202610190002_private_storage.sql",
    ])
      await db.exec(
        await readFile(
          new URL(`../supabase/migrations/${file}`, import.meta.url),
          "utf8",
        ),
      );
    await db.exec(
      `insert into auth.users values ('${owner}'),('${other}'); insert into study_private.approved_users values ('${owner}',now()); insert into public.study_opportunities(id,owner_id,title,kind,country,official_url,canonical_url) values ('${opportunity}','${owner}','Test programme','masters','Example','https://example.edu/1','https://example.edu/1'); insert into storage.objects(bucket_id,name) values ('study-documents','${owner}/private.pdf');`,
    );
    async function asUser(id, sql) {
      await db.exec(
        `reset role; set role authenticated; select set_config('request.jwt.claim.sub','${id}',false);`,
      );
      return db.query(sql);
    }
    assert.equal(
      (await asUser(owner, "select * from public.study_opportunities")).rows
        .length,
      1,
    );
    assert.equal(
      (await asUser(other, "select * from public.study_opportunities")).rows
        .length,
      0,
    );
    await assert.rejects(
      asUser(
        other,
        `insert into public.study_opportunities(owner_id,title,kind,country,official_url,canonical_url) values ('${other}','Other programme','phd','Example','https://example.edu/2','https://example.edu/2')`,
      ),
      /row-level security/,
    );
    await assert.rejects(
      asUser(
        owner,
        `insert into public.study_opportunities(owner_id,title,kind,country,official_url,canonical_url) values ('${other}','Forged programme','phd','Example','https://example.edu/3','https://example.edu/3')`,
      ),
      /row-level security/,
    );
    await asUser(
      owner,
      `update public.study_opportunities set status='shortlisted' where id='${opportunity}'`,
    );
    assert.equal(
      (await asUser(owner, `select status from public.study_opportunities`))
        .rows[0].status,
      "shortlisted",
    );
    assert.equal(
      (
        await asUser(
          owner,
          `select * from public.study_audit_events where operation='UPDATE'`,
        )
      ).rows.length,
      1,
    );
    await assert.rejects(
      asUser(
        owner,
        `update public.study_opportunities set verification_status='verified'`,
      ),
      /permission denied/,
    );
    await assert.rejects(
      asUser(
        owner,
        `update public.study_opportunities set owner_id='${other}'`,
      ),
      /permission denied/,
    );
    await assert.rejects(
      asUser(owner, `delete from public.study_audit_events`),
      /permission denied/,
    );
    await assert.rejects(
      asUser(
        owner,
        `insert into public.study_opportunities(title,kind,country,official_url,canonical_url) values ('Duplicate','phd','Example','https://example.edu/1','https://example.edu/1')`,
      ),
      /duplicate key/,
    );
    await asUser(
      owner,
      `insert into public.study_agent_tasks(opportunity_id,kind,idempotency_key) values ('${opportunity}','verification','20000000-0000-4000-8000-000000000001')`,
    );
    await assert.rejects(
      asUser(
        owner,
        `insert into public.study_agent_tasks(opportunity_id,kind,idempotency_key) values ('${opportunity}','verification','20000000-0000-4000-8000-000000000001')`,
      ),
      /duplicate key/,
    );
    await assert.rejects(
      asUser(owner, `update public.study_agent_tasks set status='succeeded'`),
      /permission denied/,
    );
    await assert.rejects(
      asUser(
        owner,
        `insert into public.study_approvals(action_type) values ('send_email')`,
      ),
      /permission denied/,
    );
    await assert.rejects(
      asUser(
        owner,
        `insert into public.study_external_actions(status) values ('succeeded')`,
      ),
      /permission denied/,
    );
    assert.equal(
      (await asUser(owner, "select * from storage.objects")).rows.length,
      1,
    );
    assert.equal(
      (await asUser(other, "select * from storage.objects")).rows.length,
      0,
    );
    await assert.rejects(
      asUser(
        owner,
        `insert into storage.objects(bucket_id,name) values ('study-documents','${owner}/upload.pdf')`,
      ),
      /row-level security/,
    );
    await db.exec(
      `reset role; insert into public.study_universities(id,owner_id,name,country,official_url) values ('30000000-0000-4000-8000-000000000001','${other}','Other university','Example','https://example.edu');`,
    );
    await assert.rejects(
      db.exec(
        `insert into public.study_programmes(owner_id,university_id,name,degree,official_url) values ('${owner}','30000000-0000-4000-8000-000000000001','Mismatch','masters','https://example.edu/programme')`,
      ),
      /foreign key/,
    );
    await db.exec("set role anon");
    await assert.rejects(
      db.query("select * from public.study_opportunities"),
      /permission denied/,
    );
    await db.exec("reset role");
    assert.equal(
      (
        await db.query(
          `select public from storage.buckets where id='study-documents'`,
        )
      ).rows[0].public,
      false,
    );
    await db.exec(
      `delete from study_private.approved_users where user_id='${owner}'`,
    );
    assert.equal(
      (await asUser(owner, "select * from public.study_opportunities")).rows
        .length,
      0,
    );
  } finally {
    await db.close();
  }
});
