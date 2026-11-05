# Technical SEO review and verification

Completed on **November 5, 2026** for [Milestone 3, PBI-14](../../documentation/milestones/Milestone-3.md#pbi-14-optimize-frontend-performance-and-technical-seo). The documented project SEO baseline is **40/100** and the target is **90–100/100**. The initial deployed audit already scored **100/100**. Fresh pre-change Home and About audits also scored 100 despite generic Create React App metadata, so this work corrects issues beyond the checks covered by that score.

**All eight audited indexable routes score 100/100 after the changes.** This is local production verification, not a final deployed audit or evidence of a score increase caused by these changes. Original baseline reports/conditions are unavailable. Rankings, indexing, and structured-data eligibility are not established by a Lighthouse score.

## Issues corrected

| Finding | Resulting behavior |
|---|---|
| All pages used “React App” and a placeholder description | Branded raw-HTML fallback; unique rendered titles/descriptions for all seven static public pages; workshop detail title follows its loaded content |
| No canonical URLs | One absolute canonical per known route, with query strings/fragments removed, trailing slashes normalized, and case aligned with routing; workshop ID case preserved |
| No sitemap; `/sitemap.xml` returned SPA fallback HTML | Generated XML sitemap lists seven public static routes; robots.txt points to it |
| Home navigation and Donate action used button click handlers | Eight Home actions and the Want-to-Help Donate action now render real anchors with `href` while retaining their MUI styling; ZIP submission remains a form/button |
| About's standalone cards were h3 siblings of a completed h2 section | Cards now use h2 semantics with the same h3 visual variant |
| Workshop details nested a main inside the layout main | Workshop details render as an article under the single layout main |
| Missing workshop had no primary heading or recovery link | Clear h1, existing error feedback, workshop-search link, and rendered noindex metadata |
| Unknown paths rendered an empty page | Page Not Found with h1, links to valid pages, and rendered noindex metadata without a misleading canonical |
| Manifest retained CRA application names | Manifest now uses TechSmart branding; existing icon assets/styles are preserved |

Lighthouse's earlier title and description checks only established that tags existed; they did not validate the quality of the placeholder text. Canonical was previously not applicable because it was absent. No scored Lighthouse SEO failure was fabricated to justify these corrections.

## Metadata and crawl configuration

[config.json](../../capstonefall2026/src/seo/config.json) is the shared source for route metadata and the production origin. [metadata.js](../../capstonefall2026/src/seo/metadata.js) updates the existing title, description, robots, and canonical elements in place and removes duplicates. [RouteMetadata](../../capstonefall2026/src/seo/RouteMetadata.js) sits outside the lazy-page boundary, so route metadata updates during navigation. Workshop details override the generic title when data loads; missing content switches to `noindex,follow` and removes the canonical.

The default origin is `https://capstone-fall-2026.vercel.app`. Set **REACT_APP_SITE_URL** to a valid site origin when deploying to another domain, then rebuild. The shared validator rejects a path, query, fragment, credentials, or malformed origin. [generate-seo.cjs](../../capstonefall2026/scripts/generate-seo.cjs) loads CRA environment files and generates [robots.txt](../../capstonefall2026/public/robots.txt) and [sitemap.xml](../../capstonefall2026/public/sitemap.xml) during `prebuild`/`prestart`, keeping their origin aligned with runtime canonicals.

The sitemap intentionally omits illustrative workshop fixtures, query URLs, fragments, and error pages. No event structured data, invented workshop schedule, sponsor contact details, or unapproved resource URLs were added. Resource buttons without approved destinations remain placeholders; this work does not invent learning content or claim those destinations are crawlable.

Navigation links now follow [Google's crawlable-link guidance](https://developers.google.com/search/docs/crawling-indexing/links-crawlable). The static HTML deliberately contains no homepage canonical shared by every deep link; the renderer inserts only the correct route canonical. This follows Google's guidance for [JavaScript-generated canonicals](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).

## Lighthouse results

| Route | Rendered title | SEO | Evidence |
|---|---|---:|---|
| `/` | Technology Help for Seniors \| TechSmart | **100** | [JSON](2026-11-05-technical-seo/after/home.report.json) |
| `/need-help` | Technology Workshops & Help \| TechSmart | **100** | [JSON](2026-11-05-technical-seo/after/need-help.report.json) |
| `/want-to-help` | Donate, Volunteer & Advocate \| TechSmart | **100** | [JSON](2026-11-05-technical-seo/after/want-to-help.report.json) |
| `/resources` | Technology Learning Resources \| TechSmart | **100** | [JSON](2026-11-05-technical-seo/after/resources.report.json) |
| `/about` | About TechSmart Learning for Seniors | **100** | [JSON](2026-11-05-technical-seo/after/about.report.json) |
| `/contact` | Contact TechSmart Learning for Seniors | **100** | [JSON](2026-11-05-technical-seo/after/contact.report.json) |
| `/donate` | Make a Donation \| TechSmart | **100** | [JSON](2026-11-05-technical-seo/after/donate.report.json) |
| `/workshops/WS-1001` | Smartphone Basics for Beginners \| TechSmart | **100** | [JSON](2026-11-05-technical-seo/after/workshop.report.json) |

Pre-change [Home](2026-11-05-technical-seo/before/home.report.json) and [About](2026-11-05-technical-seo/before/about.report.json) also scored 100; the Home score change is **zero points**. The older documented baseline-to-current difference is 60 points, but it is not attributed to this change. The workshop audit verifies a representative detail route, not the validity of the illustrative event as a production offering. Missing/unknown pages are deliberately noindex and are checked separately in the browser; they are not included in the indexable-route score target.

Method: **one SEO-only navigation audit per listed route**, Lighthouse CLI **12.8.2**, mobile **412×823 CSS px**, device scale factor **1.75**, simulated throttling. The final after audits run in two independent groups; all ten before/after reports have matching settings. This is a category/route review, not a performance-timing comparison requiring repeated timing medians. [summary.json](2026-11-05-technical-seo/summary.json) retains each audit, score, scored-check results, warnings, rendered metadata, and validation details. Structured-data review remains a manual audit; no rich-result claim is made.

## Production and functional checks

- Prebuild crawl-file generation and the production build passed. Final entry script: `/static/js/main.b72e693d.js`.
- **28 metadata regression tests passed**, covering unique metadata, canonical cleanup/case matching, deduplication, noindex recovery, client navigation, configured origins, and sitemap generation. A new [workshop transition regression](../../capstonefall2026/src/pages/WorkshopDetail.test.js) verifies valid-to-missing-to-valid metadata without remounting the router. All **18 existing App/Home/Header tests** also pass. Full suite: **64 passed, 4 failed**; the [Jest record](2026-11-05-technical-seo/test-results.json) retains the same four existing NeedHelp registration failures. Those workshop search/service/test files were not changed.
- **58 Chrome checks passed across 12 direct route captures**, plus three same-document workshop transition states. [Before](2026-11-05-technical-seo/browser-before.json) and [after](2026-11-05-technical-seo/browser-after.json) evidence covers metadata uniqueness, one main/h1 per loaded page, real hrefs, query/hash/case canonicals, errors, sitemap/robots, navigation/Back, and ZIP handling. Valid-to-missing workshop navigation removes its canonical and sets noindex; returning to a valid workshop restores its metadata. The Menu remains **111×51.5 CSS px** at 412 px and 768 px, with its existing text/padding/styles.
- Only the expected local Donate errors for an unset Stripe publishable key remain in browser evidence. No payment was submitted, and payment readiness was not tested. There are zero unexpected errors in the final browser verification and zero runtime errors in the final Lighthouse audits.
- Browser verification caught an intermediate production-only module-format issue before final audits. The shared origin validator is now [siteOrigin.js](../../capstonefall2026/src/seo/siteOrigin.js), which CRA bundles as JavaScript; `.cjs` had been emitted as a static asset. The [superseded diagnostic](2026-11-05-technical-seo/browser-after-initial-runtime-error.json) is retained separately and is not counted as final passing evidence.

[environment.json](2026-11-05-technical-seo/environment.json) records reference commit `4889069`, runtime/browser settings, and hashes of all 17 changed production files. [technical-seo.patch](2026-11-05-technical-seo/technical-seo.patch) includes the new files and associated test changes. [Before](2026-11-05-technical-seo/before/asset-manifest.json) and [after](2026-11-05-technical-seo/after/asset-manifest.json) manifests identify the builds. [Built HTML](2026-11-05-technical-seo/after/index.html), [robots](2026-11-05-technical-seo/after/robots.txt), and [sitemap](2026-11-05-technical-seo/after/sitemap.xml) snapshots preserve the deployed-artifact inputs for review.

## Limits and hosted follow-up

The app remains client-rendered. Raw HTML has a shared branded fallback; route-specific metadata and actual page content require JavaScript. It is not server-rendered or prerendered, and JavaScript-disabled crawlers/social preview services may not receive route-specific content. Google's [JavaScript SEO guidance](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics) explains these rendering limits and supports using rendered metadata when server metadata is unavailable.

The local SPA server returns **HTTP 200** for unknown paths. The new client error page and noindex tag do not produce a true server HTTP 404. Hosting/server routing must be checked during deployment. Canonicals and sitemap discovery are signals rather than indexing guarantees. Original baseline conditions are unavailable, and final verification on the deployed origin is still pending.

## Reproduction

From `capstonefall2026`, run `npm run build`, then serve the production output in another terminal:

```powershell
npm exec --yes --package=serve@14.2.4 -- serve -s build -l tcp://127.0.0.1:4173 --no-clipboard
```

From the repository root, use a new evidence directory and repeat the SEO-only command for each route in the table:

```powershell
New-Item -ItemType Directory -Path 'tests/performance/YYYY-MM-DD-technical-seo' -Force | Out-Null
npm exec --yes --package=lighthouse@12.8.2 -- lighthouse http://127.0.0.1:4173/ --only-categories=seo --form-factor=mobile --throttling-method=simulate --output=json --output-path=tests/performance/YYYY-MM-DD-technical-seo/home.report.json --chrome-flags="--headless=new --no-first-run --no-default-browser-check --disable-extensions" --quiet
```

The [browser helper](check-technical-seo.cjs) requires installed `puppeteer-core` (or `PUPPETEER_CORE_PATH`) and Chrome (`CHROME_PATH` can select it). Run each phase against its corresponding served build and preserve separate outputs:

```powershell
node tests/performance/check-technical-seo.cjs before http://127.0.0.1:4173/ tests/performance/YYYY-MM-DD-technical-seo/browser-before.json
node tests/performance/check-technical-seo.cjs after http://127.0.0.1:4173/ tests/performance/YYYY-MM-DD-technical-seo/browser-after.json tests/performance/YYYY-MM-DD-technical-seo/browser-before.json
```

Repeat the route audits on the deployed site after publication and check production headers, crawl files, deep links, and missing-route HTTP behavior. Keep this SEO-only evidence separate from the final full Lighthouse performance/SEO comparison.
