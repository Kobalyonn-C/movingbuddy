# MovingBuddy: SEO strategy (phase 2)

Not published (lives outside `public/`). **Nothing here is measured search data.** No tool with search volumes was available, so every keyword judgment is a hypothesis. The only SERP observation was one search for "how many moving boxes do I need calculator" on 2026-11-15: results were large brands and mover/storage companies (guide + calculator pages), none of them tiny tool sites.

## 1. Decisions taken
| Topic | Decision | Reason |
|---|---|---|
| Home title | Kept: `Free Moving Planner & Calculators` | Requested; matches the target query |
| Home H1 | **Kept** `Plan Your Move Without the Stress` | The alternative (`...Box, Volume, Truck & Cost Calculators`) leaves out the Checklist, which is not a calculator, and is ~5 lines at the hero's 15ch width. The keyword is carried by the title, the hero paragraph ("free moving planner") and the tool cards. Revisit only with a design change. |
| Tool titles | Changed to match each H1 and drop the ` \| MovingBuddy` suffix | Title/H1 now state the same search purpose; truck title now contains the "what size" question |
| Truck H1/desc/labels | `what size van or truck do you need?`; "Luton van" renamed "Box van" everywhere | "Luton van" is a UK term; US searchers phrase it "what size moving truck". Capacity (20 m³) and logic unchanged |
| FAQPage JSON-LD | **Removed** from 6 pages (visible FAQ kept) | Google's documentation limited FAQ rich results to government/health sites, and sources dated 2026 report they stopped appearing entirely on 2026-05-07. The markup was valid but could not produce anything. Reversible. |
| WebApplication | Kept; added `description`, `inLanguage`, `isAccessibleForFree` | Properties describe visible content |
| BreadcrumbList | Added on the 5 tool pages | A visible "Home / Tool" breadcrumb already existed |
| Redirects | **No `_redirects` file added** | Cloudflare Pages already redirects `.html` to the clean URL (verified for all 10 pages, see §8). Adding rules risks loops |
| Sitemap | Clean URLs; `lastmod` 2026-11-15 on pages with new content | Legal pages unchanged, no lastmod |

## 2. Keyword plan by URL (hypotheses, no volumes)
| URL | Primary target | Secondary / long-tail | Intent | Competition (hypothesis) | Commercial value |
|---|---|---|---|---|---|
| `/` | free moving planner | moving planner, moving calculator, moving tools | Navigational/tool discovery | Medium | Medium, brand-building |
| `/box-calculator` | moving box calculator | how many moving boxes do I need, moving boxes calculator, how many boxes for a 2 bedroom apartment | Tool + quick answer | **High** (retail and mover brands) | High (packing supplies) |
| `/moving-volume-calculator` | moving volume calculator | moving volume estimator, calculate moving volume, how much space do I need for moving | Tool | Low-medium | Medium |
| `/truck-size-calculator` | moving truck size calculator | what size moving truck do I need, how big of a truck do I need to move | Tool + answer | Medium-high (rental companies) | High (rentals) |
| `/moving-checklist` | moving checklist | moving house checklist, complete moving checklist, moving timeline | Template/printable | **High** | Medium |
| `/moving-cost-calculator` | moving cost calculator | estimate moving costs, how much does it cost to move | Tool + price research | **High** | **High** |

Cannibalization rule: tool pages own the "calculator" and tool-intent queries. Articles must own question/guide intent, never the tool query.

Known gap: US searchers think in square feet, cubic feet, miles and mpg. The tools are metric (rule: do not change units). Pages now explain conversions; a future opt-in imperial toggle would be the biggest conversion improvement.

## 3. Final metadata
| URL | Title | H1 |
|---|---|---|
| `/` | Free Moving Planner & Calculators | Plan Your Move Without the Stress |
| `/box-calculator` | Moving Box Calculator: How Many Boxes Do You Need? | Moving Box Calculator: how many boxes do you need? |
| `/moving-volume-calculator` | Moving Volume Calculator: Estimate Your Load in m³ | Moving Volume Calculator: how many cubic meters are you moving? |
| `/truck-size-calculator` | Moving Truck Size Calculator: What Size Truck Do You Need? | Moving Truck Size Calculator: what size van or truck do you need? |
| `/moving-checklist` | Moving Checklist: A Week-by-Week Plan for Your Move | same |
| `/moving-cost-calculator` | Moving Cost Calculator: Estimate What Your Move Will Cost | same |
Descriptions are in the HTML (all unique, 55-141 characters).

## 4. Internal linking
Box → Volume → Truck → Cost (button + contextual link in each page's new section). Checklist links to Cost, Truck and Box. Cost links back to Box, Truck and Checklist. Home links to all five (cards + "Where to start"). Footer links legal pages everywhere. All links use clean URLs.

## 5. Content architecture (clusters)
- **Boxes:** pillar = `/box-calculator`
- **Volume & truck:** pillars = `/moving-volume-calculator`, `/truck-size-calculator`
- **Costs:** pillar = `/moving-cost-calculator`
- **Planning:** pillar = `/moving-checklist`
Each article links up to its pillar tool and sideways to at most two siblings.

## 6. Editorial calendar: 10 articles (not published)
Publish one every ~2 weeks, starting December 2026. Facts such as prices or capacities must be sourced and verified before writing; none are assumed here.

| # | Working title | Target keyword | Intent | Tool | Key H2s | Priority |
|---|---|---|---|---|---|---|
| 1 | How Many Moving Boxes Do You Need for a 2-Bedroom Apartment? | boxes for 2 bedroom apartment | Answer + example | Box | Quick answer; By room; Box sizes; Extra supplies | High |
| 2 | How to Estimate the Volume of Your Belongings in Cubic Feet | estimate moving volume cubic feet | How-to | Volume | Measure furniture; Allowance; Convert to truck size | High |
| 3 | How Much Fits in a 10-Foot Moving Truck? | how much fits in a 10 foot truck | Specific answer (verify specs) | Truck | What fits; What doesn't; When to size up | High |
| 4 | Moving Costs to Budget For: The Complete List | moving costs budget list | Checklist | Cost | Mover fees; Truck; Supplies; Hidden costs | High |
| 5 | DIY Move vs. Professional Movers: How to Compare | DIY move vs movers | Comparison | Cost | Cost parts; Time; Risk; Decision guide | Medium |
| 6 | Moving Checklist for Your First Apartment | first apartment moving checklist | Planning | Checklist | Timeline; Essentials; Utilities | Medium |
| 7 | Things to Do the Week Before Moving Day | things to do before moving day | Planning | Checklist | 7 days to day 1; Essentials box | Medium |
| 8 | How to Pack Fragile Items for Moving | how to pack fragile items | How-to | Box | Materials; Per item type; Labeling | Medium |
| 9 | How to Prepare for a Long-Distance Move | long distance move checklist | Planning | Cost + Truck | Timeline; Budget; Vehicle | Low |
| 10 | How Much Does It Cost to Move in the US? | how much does it cost to move | Price research | Cost | Needs real, cited data | Low until sourced |

## 7. Pending tasks
1. Deploy, then submit the sitemap in Search Console and run URL Inspection on the 6 main pages.
2. Check Search Console for old `.html` URLs already indexed.
3. Measure Core Web Vitals with PageSpeed Insights/Search Console on the live site (not measured).
4. Confirm real status codes with `curl -I https://movingbuddy.pages.dev/about.html` (expect 308 or 301 to `/about`).
5. AdSense: not verified whether `*.pages.dev` is accepted; check Google's AdSense site requirements. A custom domain is likely safer. A Google-certified consent banner is needed for EEA/UK visitors before any ads. No ads were added.
6. About and Contact are very short. Expand only with real information you provide. About still says "moving house", a British idiom, because it is your original text; change it only if you want to.
7. Decide about an imperial-units mode. The tools stay metric (m², m³, km, liters); pages explain conversions.
8. Visual check on real phones/tablets and a Rich Results Test run after deployment.

## 8. Tests performed
**Phase 2 (2026-11-15)**
- Fetched the 10 live `.html` URLs with a web-fetch tool: each ends at its clean URL (`/index.html` ends at `/`). The tool shows the final URL, not the 301/308 code.
- The live site still served the old version at that time (canonical `.html`): not deployed yet.

**Closing round**
- US English: no British terms remain in `public/` (searched: luton, licence, litre, metre, centimetre, labour, enquiry, personalised, organise, colour, lifts, fridge, marker pens, tins, duvet, en-GB, day-month-year). Changes: "Luton van" → "Box van" (label only; capacity 20 m³ unchanged), "licence category" → "driver's license class", "per litre" → "per liter", "building lifts" → "building elevators", "fridge" → "refrigerator", "employer and post" → "employer and the post office", "marker pens" → "markers", "tins" → "cans", "duvets" → "comforters". Legal page `privacy.html`: "enquiry" → "inquiry" (3x) and "personalised" → "personalized" (spelling only, meaning unchanged).
- Checklist dates: `en-GB` → `en-US` (one locale argument). Verified on 2026-12-20 and 2026-03-05: all six section dates are the same real dates as before, now shown as "Dec 20, 2026".
- Calculators: the 5 tools run with the original and the final `app.js` and identical inputs. After mapping back only the words listed above, all outputs are identical (every number, trip count, percentage and total).
- About/Contact: Contact is identical to the original. About differs only in its link (`contact.html` → `/contact`). No founder, team, address or other data added; the only email is your original one.
- Final audit of all 11 pages: one H1 each; canonical = og:url = sitemap URL; og:title equals title; all OG/Twitter tags present; no `.html` links; no broken internal links; no duplicate titles, descriptions or ids; all JSON-LD parses; no FAQPage; breadcrumb URLs correct. Sitemap: 11 URLs, well-formed, no duplicates, no verification file. `robots.txt`, `_headers`, favicon and the Google verification file are byte-identical to the original. `style.css` unchanged since phase 1 (design preserved); `src/` copies in sync.
- Not done: visual tests on real devices, Core Web Vitals, Search Console, Rich Results validator, indexation checks, real HTTP status codes.

## 9. Publish
1. Copy the folder contents over your repo (keep `.git`), commit, push to `main`.
2. Cloudflare Pages builds automatically (no build command, output directory `public`).
3. Verify the live pages, then submit `https://movingbuddy.pages.dev/sitemap.xml` in Search Console.
