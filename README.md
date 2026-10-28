# 1911 Coffee Co. — website

Astro static site for 1911 Coffee Co., 28–30 Queen Street, Amble. Build plan: KAN-22.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # copies the Hairline figures into public/, then builds to dist/
```

Deploy: Cloudflare Pages, build command `npm run build`, output `dist`.

## Where things live

| What | Where |
| --- | --- |
| Opening hours (badge, table and JSON-LD all read this) | `src/content/hours.json` |
| Menu | `src/content/menu.json` |
| Reviews and rating badges | `src/content/reviews.json` |
| Address, phone, socials, banner | `src/content/site.json` |
| Photos | `src/assets/photos/*.jpg`: replace a file with a real photo of the same name |
| Colours, spacing, fonts | `src/styles/tokens.css` |
| Typewriter, deal-in, stamp, reveal motion | `src/styles/motion.css`, `src/scripts/motion.ts` |

## Hairline figures

The two line drawings in "On the counter" (`figures/cups.js`, `figures/dome.js`) are
[Hairline](https://hairline.lucasmarkes.com) figures, written for the Hairline kernel
(`public/hairline/kernel.js`, unchanged, MIT). `src/scripts/figures.ts` mounts them
when the section nears the viewport and plays each figure's tour until a hand arrives.
They take their colours from the `--hairline-*` tokens.

To work on a figure on its own, build a bench page for it with the hairline-create
skill and open `figures/hairline-<name>.html`.

## Placeholders to replace before launch

- Every photo in `src/assets/photos/` and `public/og.jpg` (they are labelled "PHOTO TO COME").
- The reviews (real quotes, with each reviewer's permission).
- The opening hours, the menu and prices, the geo coordinates, and the social links.
- The Our Story copy (marked DRAFT in `src/components/Story.astro`), the supplier names, the dog-friendly and step-free access notes.
- The roundel, which is redrawn: swap it for the client's vector logo when it arrives.
