# MovingBuddy — Your move, made simple.

Free moving planner: box, volume, truck, checklist and cost calculators. Plain HTML/CSS/JS, no framework, no backend, no paid APIs. State is kept in the visitor's `localStorage`.

## Structure
- `src/app.js`, `src/style.css` — all calculator logic and styles (edit here)
- `build.py` — generates the pages (SEO text, JSON-LD, sitemap, robots) into `public/`
- `public/` — the deployable site (already built)

## Edit and rebuild
```
SITE_URL=https://movingbuddy.pages.dev python3 build.py
```
Set `SITE_URL` to your real domain so canonical URLs and `sitemap.xml` are correct. Calculator assumptions (box mixes, item volumes, vehicle capacities) are the constants `CATS`, `V` and `VEH` at the top of each tool in `src/app.js`.

## Deploy: GitHub + Cloudflare Pages
1. Push this folder to a GitHub repository (commit `public/`).
2. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git → choose the repo.
3. **Framework preset:** None. **Build command:** *(leave empty)*. **Build output directory:** `public`.
4. Save and deploy. Add your custom domain under Custom domains.

To have Cloudflare run the generator instead, use build command `SITE_URL=https://yourdomain.com python3 build.py` and the same output directory.

## Manual steps before launch
- Replace every `[PLACEHOLDER]` in About, Contact, Privacy, Terms and Cookies (edit `LEGAL` in `build.py`, or the generated HTML) and have the legal drafts reviewed.
- Set `SITE_URL` and rebuild; submit `sitemap.xml` in Google Search Console.
- Add an Open Graph image (`og:image`) if wanted.
- AdSense: not active. Three commented `AD SLOT` markers exist on each tool page. After approval, add Google's script to `head()` in `build.py` and place units at those markers. Replace the storage notice in `app.js` with a consent tool (CMP) that fits the regions you serve, and update the Privacy and Cookie policies.
- Spanish: strings live in `build.py` and `app.js`; a `/es/` copy is the next step.
