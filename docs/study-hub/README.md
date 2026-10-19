# Study Hub — Phase 1 foundation

This release adds a private `/study-hub` application to the existing Next.js portfolio. It contains real Supabase-backed code, not a localStorage demo. It is **not operational until a Supabase project, migrations, and approved owner identity are configured**. No private records or credentials ship with the repository.

Start with [architecture](architecture.md), [setup](setup.md), [agent and import contracts](agents-and-imports.md), and [validation / implementation report](validation.md).

## Implemented routes

| Route | Behavior |
| --- | --- |
| `/study-hub/login` | Owner-only email/password login, or an honest setup-required screen |
| `/study-hub` | Counts and recent records queried from PostgreSQL |
| `/study-hub/opportunities` | Create, search, filter, sort, paginate master’s and PhD records |
| `/study-hub/opportunities/[id]` | Read source/notes, persist application stage, enqueue research |
| `/study-hub/tasks` | Read the latest 100 durable research requests |
| `/study-hub/settings` | Connection status and explicit capability limitations |

The portfolio home, case studies, assets, redirects, metadata and existing components are not rewritten. No new link exposes a private record on the public portfolio.

## Release boundary

Phase 1 plus a small Phase 2 slice is implemented. Opportunity creation, reading, and stage changes are supported; full edit/delete CRUD, bulk actions, editable deadlines, professor directories, document management, Kanban, agent execution, Gmail and scheduling are future work. No mock opportunities or simulated AI results are shipped. A saved research request stays **queued**; it does not imply work was executed.
