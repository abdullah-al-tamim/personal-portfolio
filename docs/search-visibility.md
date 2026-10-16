# Search visibility handoff

Implemented: descriptive Bangladesh-focused homepage title and copy; truthful Person/ProfilePage/WebSite JSON-LD; three static case-study URLs with unique titles, descriptions and self-referencing canonicals; sitemap coverage; existing robots and social image; preview noindex metadata. No invented rankings, titles, reviews or keyword stuffing.

The owner confirmed on 16 October 2026 that Search Console is not verified. After approving and publishing this PR:
1. Add the URL-prefix property https://abdullah-al-tamim.vercel.app/ at https://search.google.com/search-console.
2. Choose HTML tag verification. Add just its content token as GOOGLE_SITE_VERIFICATION in the production Vercel environment and redeploy. The app renders that token as the verification meta tag. Alternatively use another supported verification method.
3. Verify ownership, submit https://abdullah-al-tamim.vercel.app/sitemap.xml and inspect the homepage and three /work/ URLs. Request indexing after successful live inspection.
4. Check indexing and real query impressions/clicks over time. Prioritize name, name variants, and relevant Bangladesh automation/analytics searches. The site describes data engineering work without inventing a Data Engineer job title.
5. Keep LinkedIn and GitHub links pointing to the same canonical portfolio. Publish genuinely useful, non-confidential engineering writeups when there is evidence to share.

Search Console verification and indexing have not been performed. Search ranking and rich-result appearance are not guaranteed. No claim of being one of Bangladesh's best is published.

References: https://developers.google.com/search/docs/essentials and https://developers.google.com/search/docs/appearance/structured-data/profile-page
