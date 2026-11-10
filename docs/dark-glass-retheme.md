# Dark glass portfolio revision

## Direction

Preserve Tamim's charcoal, violet and lime identity and original animation components. Rebalance the story toward the person, research, education and future study; present employment as one part of that story. The food-ordering example is deliberately a short About paragraph describing a small script, not a featured project or quantified achievement.

UI/UX Pro Max is installed at `C:/Users/ASUS/.codex/skills/ui-ux-pro-max`. Its explicit glassmorphism result informed the material, contrast, focus and reduced-motion checks. The first generic portfolio recommendation was unsuitable and was not persisted as the design specification.

## Reference inspection

Reference: https://aelradi.engineer/
REA evidence: `ev_706571ff0c8344faab9a4b313d13db4f00eacc0e3ad7065f07e19fbdc4785d82`.
Observed in a controlled Chromium capture at 1440 x 1000: rounded asymmetric grid, translucent dark panels, a portrait column, accent light behind panels, floating pill navigation. Shipped DOM and CSS establish `#111111` at 60% opacity, `backdrop-filter: blur(24px)`, white borders at 10% opacity, approximately 32–40px corner radii and soft black shadows. The capture used reduced motion, so it does not establish the site's full animated choreography. Its background canvas declares Three.js; no claim is made about its internal shader implementation.

Our implementation adapts the material rather than copying the reference's content, photographs, logo or assets. It uses existing lightweight canvas/CSS animations rather than introducing a new 3D dependency.

## Implementation

- New original AT vector monogram shared between header and favicon.
- Scoped CSS module for the public homepage. Dark glass cards, floating header, portrait and responsive grid.
- Restored FlowBackground, FlowExhibit, PracticeCards and TubeVaultProject. Existing case-study animations retained.
- Academic CV immediately accessible; research and contributions visible before professional work.
- Interests grouped into learning from data, building with data, and practical development/automation.
- Honest research limitations and professional metric caveats retained.
- Archive recordings remain opt-in; global motion control and reduced-motion support retained.
- Credentials condensed using native disclosure; original credential links retained.
- Private Study Hub logic, permissions and data are unchanged.

## Content boundaries

No thesis accuracy, research result, user count, savings estimate or food-script technology was invented. The README and current timeline disagree on the teaching end date; this revision does not assert a newly resolved date or alter the CV PDFs. Existing work-role attribution and approximate figures remain unchanged.

## Review and publishing

This is a review branch. Production still requires the owner's approval and merge as described in the repository README. Local preview contact sending is unavailable without the existing EmailJS public configuration; direct email remains available. No real email was sent during verification.

## Verification

- Production build passed with Node 22 and `next build --webpack`, including static pages and case-study routes. An initial Windows directory-creation error was resolved by creating the required build-output directory; the subsequent build completed.
- All 15 existing tests passed; lint passed for edited components; `git diff --check` passed.
- Browser checks completed at widths 375, 768, 1024 and 1440 with no horizontal overflow. Confirmed computed glass blur, mobile navigation, global pause/resume and case-study animation controls. No console errors were observed on the tested case-study page.
- Saved desktop screenshot is in the task outputs folder. After the account change, browser control was disabled; no further visual checks were possible on that account.
- Local branch: `codex/dark-glass-portfolio`. Prepared for GitHub review and a preview deployment; production remains unchanged.
