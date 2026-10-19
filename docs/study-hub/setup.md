# Setup and deployment checklist

## Local development

Use Node 22.x as specified by the existing project.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Without configured environment variables, `/study-hub/login` shows setup-required and all private routes redirect there. The public portfolio still builds and serves. Do not add an authentication bypass or demo identity to get around setup.

## Supabase provisioning (not performed by this PR)

1. Create a **dedicated** Supabase project for this private workspace. Do not reuse a project with permissive public table/storage policies.
2. Apply `supabase/migrations/202610190001_study_hub.sql`, then `202610190002_private_storage.sql` through trusted migration tooling or the Supabase SQL editor. Each migration is transactional. Apply once, in order; migration 1 is not designed for rerunning as a seed.
3. Disable public user signup in Supabase Auth. Configure email/password authentication and appropriate login rate limits. Create one confirmed owner account with a strong password through trusted Supabase administration tooling. Do not commit or send the password in a PR.
4. Copy the confirmed account's exact UUID and add it to the private allowlist through the SQL editor. Replace the placeholder locally only:

```sql
insert into study_private.approved_users(user_id)
values ('REPLACE_WITH_CONFIRMED_AUTH_USER_UUID');
```

5. Configure `.env.local` using the following server-only variables. The same owner UUID must appear in both configuration and the allowlist.

| Variable | Purpose |
| --- | --- |
| `SUPABASE_URL` | Trusted project endpoint, e.g. `https://PROJECT.supabase.co` |
| `SUPABASE_PUBLISHABLE_KEY` | Project publishable/anon key; used with owner session so RLS applies |
| `STUDY_HUB_OWNER_ID` | Exact confirmed Auth user UUID; no email-domain wildcard |

No `NEXT_PUBLIC_*` variables are needed. Do not add a Supabase service-role key to the web app. No model, Gmail, GitHub, or ChatGPT Work credentials are required for this release.

6. Open `/study-hub/login`, sign in, create an opportunity, change its stage, reload, and confirm persistence in the app and Supabase. Queue a request and confirm the durable row and audit entries. It must remain `queued` because no worker is installed.
7. Verify sign-out, rejected credentials, a different user, expired/revoked sessions, removed allowlist membership, direct record URLs and direct PostgREST attempts. Confirm private no-store/noindex headers and secure production cookies.

The current login flow uses email/password server actions and HTTP-only scoped cookies, not OAuth. Password reset, signup, OAuth callbacks and MFA enrollment UI are not implemented. Use trusted account administration for recovery until those flows exist.

## Tests

```sh
npm run lint
npm test
npm run typecheck:contracts
npm run build
npm run test:study-hub:http
```

`npm test` includes PGlite PostgreSQL migration and RLS tests. It creates synthetic Auth and Storage schemas; this is real local SQL execution but is **not** a live Supabase integration test. The HTTP smoke script starts a production server with credentials explicitly blank and checks fail-closed routes plus public-page availability. It must run after build.

The existing CI now runs these checks on Node 22. Local validation in this implementation environment used Node 24; CI remains the Node 22 gate.

## Deployment

- Review and merge the PR only after checks and setup review. This PR does not merge itself or alter the Vercel project configuration.
- Verify the existing Vercel project still targets this repository root and uses Node 22.
- Use a separate Supabase project/owner for preview validation. Do not expose production private data to preview branches or PR builds.
- Add variables to the intended environment in Vercel's protected settings; keep `.env.local` ignored.
- Apply migrations before enabling authenticated traffic. Confirm RLS on every `study_*` table, allowlist membership, private bucket settings and disabled public signup.
- Preview validation: public home/case studies, private login, persistence, mobile layouts, keyboard controls, rejected user, session refresh, sign-out, direct unauthorized requests, DB errors and missing configuration.
- No automatic database migrations run from public CI. No production credentials are needed in CI.
- Verify response caching in the deployed environment; do not enable ISR or public CDN caching for `/study-hub`.

## Monitoring, backup and rollback

Audit triggers record database mutations; production alerting and external auth event monitoring are not configured. Add alerts for Auth failures, DB errors and future worker queue age/failed attempts before enabling automations. Never put raw tokens, document text or email contents into application logs.

Enable a suitable Supabase backup/PITR plan and verify an isolated restore. Back up private Storage objects separately; a database backup alone does not preserve their bytes. Define retention and deletion policies for documents and messages. Exports should go to encrypted private storage outside this repository. No backup job is supplied or claimed operational.

Rollback the application to its previous deployment to remove the hub routes. Leave the database intact for recovery; do not drop tables as a routine rollback. Revoke access by deleting the allowlist row and ending the owner's Auth sessions. Restoring access requires an administrator and the exact configured owner UUID.

## Reproducible browser fixture check

```sh
npx playwright install chromium
npm run build
npm run test:study-hub:browser
```

This optional check launches a local synthetic Auth/PostgREST fixture and the real
production Next.js server, exercises sign-in/create/status/queue/reload/logout,
and captures desktop/mobile screenshots under ignored `artifacts/`. It never
uses production credentials and is not a live Supabase integration test.
`STUDY_HUB_TEST_BROWSER` may point to an existing compatible Chromium binary in
constrained test environments. CI's default gate does not download a browser.
