# Launch checklist — 1911 Coffee Co.

Nothing on this list has been verified. The site is built so that each item can be confirmed
by editing one data file, and until then the page says "to be confirmed" rather than guessing.

## Needs the café's approval or confirmation

| # | Item | Where it lives | What the site does until then |
| --- | --- | --- | --- |
| 1 | **Photo permission.** All six photos were taken from 1911's public Instagram and Facebook (see `src/assets/photos/CREDITS.md`). Get Joe's written permission, ideally with the full-resolution originals. | `src/assets/photos/` | Shows them. **The GitHub repo is public and GitHub Pages is on, so they are already published.** Make the repo private or remove the photos until permission is given. |
| 2 | **Opening hours.** The values in the file are placeholders. | `src/content/hours.json` → set `"verified": true` | Hides the times, asks visitors to ring or check Facebook, and leaves hours out of the structured data. |
| 3 | **Menu and prices.** The dishes are ones the café has published or posted before, not the confirmed current menu. Every price is `null`. | `src/content/menu.json` → fill in `price`, set `"verified": true` and `"checked"` | Shows a "Prices to follow" stamp and "—" for every price. |
| 4 | **Missing menu sections:** cold drinks, children's options, extras and milk alternatives, tea and other hot drinks. | `menu.json` → `"missing"` | Not shown. |
| 5 | **Dietary tags.** Only "Vegetarian Breakfast" is tagged V, because the name says so. Confirm tags with the kitchen; never guess. | `menu.json` → `tags` | Shows only that one tag. |
| 6 | **Menu PDF**, if there is one. | `menu.json` → `"pdf"` | No PDF link. |
| 7 | **Allergen wording.** The site says "please ask at the counter". | `menu.json` → `"allergens"` | As written. |
| 8 | **Address and phone:** 28–30 Queen Street, Amble, NE65 0BZ · 01665 710706, as currently listed. | `src/content/site.json` | Shown. |
| 9 | **Social links.** Instagram `@1911coffeeco` and Facebook `1911coffeeco` were found in research; confirm they're the café's accounts. The Tripadvisor link is a search, not the listing. | `site.json` → `socials` | Shown. |
| 10 | **Ratings.** Tripadvisor showed 4.9 from 163 reviews on 29 October 2026; re-check on launch day. The Google rating is unconfirmed. | `src/content/reviews.json` | Shows Tripadvisor only; Google is linked, not scored. |
| 11 | **Review quotes.** None are published. Add real quotes only with each reviewer's permission. | `reviews.json` → `quotes` | The Visitors chapter links out to the reviews instead. |
| 12 | **The coffee biscuit.** One photo shows a biscuit on the saucer; confirm it's still served before it becomes a promise. | `Coffee.astro`, `Little.astro` captions | Captions describe the photo only. |
| 13 | **Accessibility and parking** information. | `FindUs.astro` | Not mentioned. |
| 14 | **Bookings and online ordering.** Neither exists on the site. If the café takes bookings, link the real process. | `FindUs.astro` | Says "This isn't a booking, just an invitation." |
| 15 | **Staff and customer photographs**, with everyone's permission. | `Welcome.astro` | Uses an illustration instead. |
| 16 | **Founding date and story.** The site makes no claim about when the café opened, and doesn't treat "1911" as a date. | — | — |
| 17 | **Brand name style:** "1911 Coffee Co." throughout. | — | — |
| 18 | **Production domain.** The current site appears to be 1911cafe.co.uk; confirm before launch. | `astro.config.mjs` → `site`, `public/robots.txt` | Canonical and sitemap use 1911cafe.co.uk. |
| 19 | **Map position.** The schematic map is labelled "not to scale"; the geo coordinates in `site.json` are approximate and not used on the page. | `site.json` → `geo` | Directions open Google Maps by address. |
| 20 | **Open Graph image** (`public/og.jpg`) is an old placeholder; replace it with a 1200×630 crop of the shopfront once photos are approved. | `public/og.jpg` | Placeholder. |

## Technical, before go-live

- [ ] **Deployment.** The GitHub Pages workflow uploads the raw repository (`path: '.'`), not the built site, so it won't serve the website. Either change it to run `npm ci && npm run build` and upload `dist`, or deploy to Cloudflare Pages (build `npm run build`, output `dist`).
- [ ] Re-run `node tools/axe.cjs` (WCAG 2.2 AA) and Lighthouse after content changes.
- [ ] Test on a real iPhone (Safari) and Android phone (Chrome). Only headless Chromium has been used so far.
- [ ] Submit the sitemap in Google Search Console and update the Google Business Profile website link.
