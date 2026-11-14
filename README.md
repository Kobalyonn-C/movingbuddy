# MovingBuddy — Your move, made simple.

Free moving planner with box, volume, truck, checklist and cost calculators. The site uses plain HTML, CSS and JavaScript, with no framework, backend or paid APIs. Moving-plan data is stored in the visitor's browser using `localStorage`.

## Project structure

- `public/` — the live website files. Cloudflare Pages deploys this directory directly.
- `public/assets/app.js`, `public/assets/style.css` — JavaScript and CSS loaded by the published pages.
- `public/*.html` — the website pages, including the calculators and legal pages.
- `src/app.js`, `src/style.css` — source/reference copies of the JavaScript and CSS. Keep these in sync with the corresponding files in `public/assets/` when making changes.
- `build.py` — legacy generator, intentionally disabled. **Do not run it.** It is not part of the current deployment workflow.

## Editing the website

The published site is served directly from `public/`. To change the live website:

1. Edit the relevant HTML file in `public/`, or edit `public/assets/app.js` / `public/assets/style.css` for shared functionality and styling.
2. If you change `public/assets/app.js` or `public/assets/style.css`, copy the same changes to `src/app.js` or `src/style.css` so the reference copies remain synchronized.
3. Commit and push the changes to the GitHub `main` branch.
4. Cloudflare Pages will deploy the updated `public/` directory automatically.

Do not run `python3 build.py` and do not configure a build command in Cloudflare Pages. The legacy generator is disabled to protect manually maintained pages, SEO files and Google Search Console verification files.

## Deploy: GitHub + Cloudflare Pages

The current Cloudflare Pages configuration is:

- Git repository: `movingbuddy`
- Production branch: `main`
- Framework preset: `None`
- Build command: leave empty
- Build output directory: `public`

Push commits to `main`; Cloudflare Pages publishes the contents of `public/` automatically. No build step is required.

## Before making changes

- Preserve the legal pages: `public/privacy.html`, `public/terms.html` and `public/cookies.html`.
- Preserve `public/sitemap.xml`, `public/robots.txt`, `public/_headers`, the favicon and the Google Search Console verification file.
- If a page URL changes or a new page is added, review `public/sitemap.xml` and internal links.
- After deployment, check the changed page on the live website and test any affected calculator interactions.

## Future work

- AdSense is not currently active. Review applicable consent, privacy and cookie requirements before adding advertising or analytics services.
- Spanish-language pages may be added in a future release.
