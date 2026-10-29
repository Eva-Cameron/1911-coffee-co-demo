# Launch checklist — needs the café's approval

- [ ] **Photographs**: written permission to use the nine photos taken from 1911's Instagram and Facebook (list in
      `src/assets/photos/CREDITS.md`). Ideally swap in the original full-resolution files.
- [ ] **Opening hours**: Monday–Saturday 8:00–15:00, closed Sunday (`src/content/hours.json`).
- [ ] **Menu**: every line in `src/content/menu.json`, especially those marked `"confirm": true` (the coffee list,
      tea, toasted fruit bread, salads) and the four legible prices.
- [ ] **Biscuit with coffee**: still served? (Chapter II copy)
- [ ] **Ratings**: re-check Tripadvisor (4.9, 163) and Google (4.8, ~207) on the day of launch (`reviews.json`).
- [ ] **Visitor quotes**: none are shown. Add real quotes only with each reviewer's permission.
- [ ] **Dogs, step-free access, parking**: not stated anywhere yet; add once confirmed.
- [ ] **Food hygiene rating 5**: confirm on ratings.food.gov.uk before quoting (not shown yet).
- [ ] **Domain**: 1911cafe.co.uk belongs to a different café in Essington. Choose and register the real domain,
      then set `site` in `astro.config.mjs` and the canonical URL.
- [ ] **Social links**: Instagram and Facebook point to @1911coffeeco; Tripadvisor link is a search URL — swap for
      the listing URL.
- [ ] **Story copy**: Chapter I is written from verified facts only; replace or approve with the café.
- [ ] **GitHub Pages workflow** uploads the raw repository, not `dist/`; fix before relying on it.
