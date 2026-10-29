# 1911 Coffee Co. — website

**The Wonderfully Ordinary World of 1911.** A single-page Astro site for 1911 Coffee Co.,
28–30 Queen Street, Amble, Northumberland, told as nine chapters of a small, slightly eccentric
film about a British café.

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # copies the Hairline figures into public/, then builds to dist/
npx astro preview # serves dist/ at http://localhost:4321
```

Before launch, work through **[LAUNCH-CHECKLIST.md](LAUNCH-CHECKLIST.md)**: hours, prices,
photo permission and the other facts the café still has to confirm.

## The chapters

| | Chapter | Field | Component |
| --- | --- | --- | --- |
| | Opening scene: "A very good day for coffee." | cream → mint | `src/components/Hero.astro` |
| I | A Place for the Everyday Extraordinary | cream | `chapters/Place.astro` |
| II | The Coffee Department | blush, custard | `chapters/Coffee.astro` |
| III | The Breakfast Department | custard, cherry checker | `chapters/Breakfast.astro` |
| IV | Lunch, Please | sky | `chapters/Lunch.astro` |
| V | The Little Things (photos and two Hairline exhibits) | paper | `chapters/Little.astro` |
| VI | A Very Welcome Table | mint | `chapters/Welcome.astro` |
| VII | Word from Our Visitors | cream | `chapters/Visitors.astro` |
| VIII | The Menu | burgundy, paper card | `chapters/MenuCard.astro` |
| IX | Find Us in Amble | shopfront orange | `chapters/FindUs.astro` |
| | End credits | burgundy | `src/components/Footer.astro` |

Chapter anchors, numerals and titles come from `src/content/chapters.ts`; the header, the phone
Contents sheet and the pages all read it.

## Where things live

| What | Where |
| --- | --- |
| Menu: dishes, prices, notes, allergens, PDF link | `src/content/menu.json` |
| Opening hours | `src/content/hours.json` |
| Ratings and review quotes | `src/content/reviews.json` |
| Address, phone, directions link, socials | `src/content/site.json` |
| Photos (and where each came from) | `src/assets/photos/`, `CREDITS.md` |
| Colours, type, spacing, motion tokens | `src/styles/tokens.css` |
| Base styles, fields, motifs, buttons | `src/styles/global.css` |
| Intro sequence and scroll reveals | `src/styles/motion.css`, `src/scripts/motion.ts` |

Each data file has a `verified` flag. While it's `false`, the page says the information is being
confirmed rather than presenting it as fact: prices show as "—" under a "Prices to follow" stamp,
and hours are replaced by "please ring before you travel".

## Design system

- **Palette** (`tokens.css`): cream, paper, mint, blush, custard and sky fields; espresso and
  burgundy inks; cherry as the one accent; and the real shopfront orange. Every text pair is
  measured in the file's header comment. Cherry text is only used on cream, paper and custard.
- **Type**: Fraunces (headlines, with italics), Limelight (chapter numerals and signage),
  DM Sans (reading and navigation), IBM Plex Mono (plate numbers and other archival details).
  All are OFL fonts, self-hosted through Fontsource, with no Google Fonts request.
- **Motifs**: `Wordmark`, `Seal` (a printed stamp), `Bean`, `Cup` (it rocks on hover),
  `Intertitle` (chapter headings; write `|` between lines and `_word_` for italics), `Plate`
  (a matted photograph with corner marks and a "Plate No." caption), `TableSetting` and
  `GuideMap` (original line illustrations), plus `.rule`, `.corners` and `.checker` in global.css.
- **Motion**: CSS and IntersectionObserver only, with no animation library. The opening curtain
  takes about 1.4s; headlines rise line by line and photographs open behind a vertical mask as
  they scroll in. Small touches: the cup rocks, the stamp lands on the letter, and the "Find us"
  bean bobs. Everything is visible at once with `prefers-reduced-motion` or without JavaScript.

## Hairline figures

Exhibits A and B in Chapter V (`figures/cups.js`, `figures/dome.js`) are
[Hairline](https://hairline.lucasmarkes.com) figures on the unchanged Hairline kernel
(`public/hairline/kernel.js`, MIT). `src/scripts/figures.ts` loads them when the chapter nears
the viewport and plays each figure's tour until a hand arrives.

## Checks

```bash
node tools/axe.cjs                      # WCAG 2.2 AA at 1440px and 375px (needs the preview running)
node tools/scenes.cjs <out-dir> 390     # screenshot every chapter at a width; reports overflow and console errors
python3 tools/single-file.py            # one self-contained HTML file, for sending a preview
```
