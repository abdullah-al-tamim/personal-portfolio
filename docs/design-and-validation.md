# Systems Atlas — design and validation

## Audit (14 October 2026)

PR #2 was merged by the owner on 13 October. The deployed website matches its professional content and ivory/ink design, rather than the original 2024 sticker portfolio. The new feature branch starts from main at 79df6c8. Desktop and mobile inspection confirmed the familiar two-column portrait hero, generic project cards, short expandable descriptions, repeated section layouts, and illustrative diagrams that did not explain an actual decision.

Preserved: verified chronology and qualifiers, the supplied navy-suit photograph, three direct PDF CVs, six certificate images, and the three original EEG/attendance/railway recordings. Excluded: stickers, stock project imagery, unreliable EEG accuracy, invented financial attribution, private reviews, patient records, internal URLs, and proprietary screenshots.

## Reference study

- [Antinomy Studio](https://www.antinomy.studio/): inspected desktop composition and the relationship between restrained navigation and large visual work. Its work is also featured in [Awwwards' project gallery](https://www.awwwards.com/inspiration/project-gallery-detail-3).
- [Claude Type](https://claudetype.com/), discovered through [Siteinspire](https://www.siteinspire.com/website/13351-claude-type): inspected typographic hierarchy and consistent art direction across the media. No typeface, illustration, layout, or asset was copied.
- [Siteinspire selected websites](https://www.siteinspire.com/websites/selected): surveyed typographic/editorial and technical references. Godly redirected to another gallery that the research tool could not access; no claim is made to have inspected it.

## Three directions evaluated

| Direction               | Originality                                                        | Clarity / credibility                                                              | Feasibility                                         | Decision                                                   |
| ----------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------- | --------------------------------------------------- | ---------------------------------------------------------- |
| Kinetic journal         | Expressive oversized type, split compositions, moving text         | Strong personal voice, but motion could overwhelm the engineering evidence         | Lightweight, straightforward                        | Retain typographic discipline, not the moving-text premise |
| Spatial systems exhibit | Explorable 3D objects and data pathways                            | Memorable, but spatial navigation adds friction for recruiters and mobile visitors | Higher rendering cost, more fallback work           | Reject unnecessary 3D complexity                           |
| Systems Atlas           | Interactive diagrams integrated into numbered technical narratives | Direct connection between visual behavior and real engineering decisions           | SVG/React/CSS, accessible controls, static fallback | Selected                                                   |

## Visual and interaction language

Mineral paper (#f0f1ed), graphite (#202522), vermilion (#c63920). Local Geist for display/body and Geist Mono for small figure labels; restrained Georgia italics distinguish the human/research sections. No remote fonts. Large offset typography, ruled editorial layouts, a sticky work index, and differentiated research/profile/credential/contact compositions.

Five main interactions: synthetic records reorganize in the hero; three study models change with explicit stage controls; engineering notes expand natively; original recordings play only on demand; navigation and links have purposeful focus/hover states. The architecture model shows serial, parallel, and cached structures without inventing benchmarks. The routing model uses fictional categories. Mobile replaces dense SVG annotations with readable HTML diagrams. The supplied portrait is cropped with CSS and shown in monochrome on desktop, with original color on hover/touch; no generative face changes.

## Content provenance

2025 and H1 2026 reviews were reconciled during the prior CV work; public content retains their reporting periods and ownership qualifiers. The owner confirmed the current plural title, employer branding, technical capabilities, degree details, and target audience in the 14 October brief. The 18k-to-4k figure describes an approximate import-error backlog over three weeks, not a rate. The 96 figure describes deprecated logic instances updated. Broader 2025 totals are not attributed to a single case study. No performance benchmark is fabricated.

## Validation

Local production build and ESLint pass. Browser QA includes desktop (1440), tablet (768), mobile (390), and narrow mobile (320); check results and screenshots are included with the PR. Tested stage selection, hero toggle, native disclosures with keyboard, mobile menu/Escape focus return, copy-address, original recording playback, and global pause. Pause removes GIFs, disables their play controls, stops animated paths and transitions, and changes smooth scrolling to auto. Reduced-motion media rules cover transitions/animations and the React preference listener prevents recording playback; the browser tooling does not expose OS-preference emulation.

All three PDF downloads, both legacy CV redirects, the generated Open Graph image, sitemap, and robots are verified over HTTP. Certificate media are checked for successful loading. No field Core Web Vitals are claimed; the page is statically generated, has no third-party runtime scripts, and keeps interactions on the existing React dependency.

## Deployment and maintenance

Use the existing Vercel Next.js preset and Node 22. Do not merge/deploy production without owner approval. Preview access may require the owner's Vercel sign-in. CV PDFs are October 2026 snapshots and need replacement when the source resumes change. Certificate/research links point to their existing public records; external destinations can change independently.

## Follow-up — 15 October 2026

Restored direct-contact form using the original EmailJS configuration and field mapping, added a repository-specific contribution milestone from user-supplied evidence, and added a custom pointer-responsive canvas field based on the requested Antigravity reference. The canvas has static fallbacks and visibility-aware rendering. The contribution rank is not company-wide, and profile contribution counts are not substituted for repository commit analytics. Private evidence remains outside this public repository. Contact transport tests use mocked requests; real email delivery is not claimed without an authorized end-to-end send and recipient confirmation.


### Owner clarification and opening revision — 15 October 2026

Moved the portrait, name, current role, and employer above the main headline. Increased particle contrast and density, added continuous drift and a local pointer attractor, and retained pause/reduced-motion/visibility controls. Rebuilt reconciliation as an encounter audit alongside an existing EHR import: report extraction, database count comparison, and discrepancy investigation. Removed the backlog metric from this case study to avoid conflating remediation with auditing. Example counts are explicitly fictional. Desktop (1440px) and mobile (390px) browser review passed, with no horizontal overflow or browser errors; diagram controls and global pause checked. Lint, production build, and all four mocked contact tests passed.


### Structured motion and live email diagnosis
Particle positions now belong to ordered lanes on a shared animated wave surface, with an accent spine and localized pointer deformation. An owner-authorized test on the preview reached EmailJS and received HTTP 412, classified in the connected-mailbox error family. Delivery remains blocked; configuration presence is not a delivery guarantee. Vercel MCP project access returned 403 for the owner team. Error handling now maps provider responses to bounded, actionable messages without exposing raw credentials or provider bodies. Five mocked transport/diagnostic tests, lint and build passed.


### Bubble motion and confirmed Gmail error — 16 October 2026
Revisited Antigravity and compared idle, right-pointer and left-pointer states. Replaced the previous wave lanes with an original rounded-lens particle field: overlapping radial inflation, continuous idle movement, smoothed pointer tracking, depth-dependent point size and muted colors. Desktop/mobile rendering and pause controls checked; lint, five contact tests and production build passed.

With owner-authorized dashboard access, EmailJS history explicitly reported `Gmail_API: Invalid grant. Please reconnect your Gmail account`. The service identifier matched the owner-provided service. A fresh portfolio test also returned HTTP 412. Reconnection must be completed by the owner; successful delivery is not claimed. No private dashboard screenshots or message contents are committed.

## Follow-up: clearer workflows and bounded page motion (16 October 2026)
- Replaced the static encounter audit with a three-stage extraction/comparison/investigation walkthrough. Labels identify Python, Playwright/Selenium, SQL, and Retool roles.
- Replaced abstract responsibility routing with the team-built import-error resolver: missing member ID, same-patient historical lookup, proposed solution. Values are fictional; no private data or internal URLs.
- Owner confirmed that extraction was selected for product integration for all operations teams. Copy does not claim rollout completion.
- Added automatic walkthroughs with local pause/manual selection; global pause, reduced motion, hidden-document and offscreen behavior stop stage timers.
- Moved the decorative field to a single viewport-sized background throughout light sections. Reduced cursor radius from 260px to 115px, capped dot size, reduced displacement, and retained regular formation. Dark sections and diagrams remain opaque for readability.
- Lint, five contact tests and production build passed. Fresh visual QA is pending: browser automation cannot start because its installed runtime's kernel.js is missing. No claim of an exact Antigravity match, new screenshots, or fresh browser interaction verification is made for this follow-up.

## 16 October follow-up: quieter motion, shorter first read, search visibility
Replaced the particle lenses entirely with twelve ordered flow lines and small travelling signals. Pointer bending is limited to 18px; static reduced-motion/global-pause and hidden-document handling remain. Homepage case-study paragraphs now live inside disclosures; research details are also optional. Both missing and excess database-count examples are available, with duplicate investigation explicitly distinguished from proof of duplicates. Full case studies are statically rendered at /work/reconciliation, /work/architecture and /work/intelligence.
SEO: truthful ProfilePage/Person/WebSite JSON-LD, Bangladesh-focused title/description and visible introduction, per-case canonical URLs and metadata, sitemap entries, preview noindex, optional Search Console verification token. Owner confirmed Search Console is not verified; docs/search-visibility.md covers the remaining owner setup. No ranking guarantee.
Validation: ESLint and production build pass. Rendered HTML checks verify JSON-LD parsing, home identity/audit controls, individual case canonical links and sitemap coverage. Browser runtime still fails to start; live animation/responsive visual QA remains pending.

## EEG archive navigation and automation background
The EEG research CTA now links to #eeg-demo in the project archive and sets shared playback state to the EEG recording. Original GIF playback is explicitly user-initiated, with the existing stop control and global motion pause retained. Reduced-motion preferences keep the decorative canvas static without prohibiting an explicitly requested recording. The archive code link is labeled private/access required.
The background now represents uneven inputs aligning into parallel lanes, passing two validation gates, and leaving as uniform output records. Pointer proximity highlights gates without expanding the formation. Three lanes on mobile and five on desktop; no new dependencies.
Lint and production build pass. Generated HTML confirms the EEG target/link, recording asset and private-repo label. Live browser playback/visual QA is still pending because the browser runtime fails to start.

## 17 October: recording-based hero motion
Chrome and native computer-use runtimes both failed to start. Instead inspected the owner's 25.617-second, 60fps recording locally: sixteen overview frames and six 300ms-spaced closeups around the cursor sweep. The reference preserves a lattice of tiny marks while a smooth bulge and delayed wake deform it. Sparse inactive regions remain quiet. This supersedes the earlier flow-line and pipeline interpretations.
Implemented a bounded, coherent point surface with a trailing focus, low-amplitude pulse, colored tangent marks, and idle drift. Mark radius is capped below 1.9 CSS pixels and surface displacement is bounded. The canvas is now inside the hero, absolutely positioned and clipped; all page-wide background motion is removed. Offscreen/hidden/global pause/reduced-motion behavior retained. No reference video or extracted frames are committed.
Validation: seven unit tests pass (including new deformation/size bounds and stationary-cursor pulse), lint and production build pass. An isolated field study was rendered for inspection; it is not a browser screenshot. Full live-page visual and cursor QA remains blocked by the browser runtime. The implementation is a recording-based recreation, not a verified identical copy of Google's implementation.

### REA-based hero reconstruction — 18 October 2026
Installed REA 6.5.0 locally and used its isolated Chrome scenario capture and script export to inspect the public Antigravity hero. Source inspection and screenshots show an annular particle field, radial strokes, a breathing radius, spatial noise and slow pointer interpolation. This supersedes the earlier Gaussian point-surface interpretation. The implementation is original Canvas code; no Google source/assets are included.

The hero now has a bright, softly deforming rim around a quieter centre, uneven point spacing, slow cursor following, continuous idle breathing and spatial colour transitions. Mark size is bounded independently of pointer position. The effect remains confined to the hero; pause, reduced-motion, offscreen and hidden-tab controls are retained.

Validation: seven tests and ESLint pass. Production build passes with `next build --webpack`; local Turbopack fails while starting its CSS compiler subprocess, including outside the sandbox. No build configuration was changed to hide that local failure. REA Chrome captures cover desktop idle/pointer states, pause and mobile reduced motion. Evidence is retained in the local workspace outputs, not the public repository. This is a behavioral recreation, not a pixel-identical copy of Google's GPU implementation.
