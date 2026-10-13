# Abdullah Al Tamim — portfolio

Professional portfolio for data automation, operational analytics, and applied AI research. Built with Next.js, React, locally hosted Geist fonts, and lightweight CSS/Web Animations interactions.

## Run locally

Use Node.js 22 LTS (22.13 or newer).

```sh
npm ci
npm run dev
```

## Checks

```sh
npm run lint
npm run build
npm start
```

Pull requests run lint and a production build in GitHub Actions. Vercel can deploy the repository using the standard Next.js preset. Review the PR preview before merging to the production branch.

## Content and assets

- `src/assets/portfolio.js`: selected work, contribution summaries, capabilities, and CV filenames.
- `src/components/Portfolio.jsx`: page sections and interactions.
- `src/app/globals.css`: responsive layout, colors, hover states, and reduced-motion styles.
- `public/images/abdullah-al-tamim.png`: supplied navy-suit portrait, used without generative alteration. Next.js optimizes it for display.
- `public/cv/`: three confirmed CV PDFs from the October 2026 CV revision. Replace these when the source CVs change; they are snapshots, not automatically synchronized.

The original CV URLs redirect to current PDFs. Downloads use local PDF files and do not require access to the private resume repository.

## Content rules

Career content was reconciled against the CV review and direct confirmations on 12 October 2026. Employment began February 2025; Senior promotion was March 2026. Graduation was June 2024. Teaching assistance ran April 2022–May 2024.

Keep the 2025 period attached to impact metrics. Approximately 70 team hours/week is an estimate. $10M+ refers to tracked claims value supported, not revenue recovered. Preserve shared ownership of the eClinicalWorks project. The EEG thesis is unpublished; do not restore the earlier accuracy claim. Publication contribution is preprocessing, training, and writing.

Work diagrams are abstract illustrations, not screenshots or live data. No private reviews, patient data, internal links, or credentials are included. The previous template content, placeholder projects, and unused testimonial data have been removed.

## Interaction and accessibility

Native anchor navigation and expandable details work without JavaScript. Project filters and the mobile menu are enhanced with React. Motion respects `prefers-reduced-motion`, and the footer includes a pause control. Links and buttons have visible keyboard focus. Contact uses email and a copy-address button, without a third-party contact-form service.

## Original media archive

The project archive reuses the existing EEG, face attendance, and railway reservation GIF recordings with explicit play/stop controls. They are not downloaded or animated before a visitor chooses to play. The global motion control stops them too. The credentials gallery retains six original certificate images, including the time-series course that previously existed only as an unused asset. Titles and dates were checked against the certificate images. Original portrait/sticker and stock assets remain in Git history; none is used in the redesigned page.
