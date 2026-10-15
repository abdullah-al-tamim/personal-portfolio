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
