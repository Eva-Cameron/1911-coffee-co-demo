# Design — "The Wonderfully Ordinary World of 1911"

## The idea

A visit to 1911 is a small, delightful interruption to an ordinary day. The site is built as a short film about
it: an opening shot of the orange shopfront, then chapters with intertitles, numbered "plates" for photographs,
and end credits. The real shop supplies the props: the fascia, the 28–30 door, the biscuit on the saucer,
the printed brunch menu, the chalk "Open" sign.

## Audience and job

Locals and visitors to Amble who want to know, in seconds: where it is, whether it's open, what's on, how to
order ahead. The film conceit is the wrapping; the menu, hours, phone and directions are never more than one
tap away (header, opening scene, Chapter VIII, Chapter IX).

## System

- **Type**: Fraunces for headlines (bold, soft), Fraunces italic for asides; Limelight for the "1911" wordmark
  and chapter numerals; DM Sans for reading; IBM Plex Mono, small and tracked, for plate captions, prices and
  chapter labels. Five sizes on a page.
- **Colour**: one field per chapter — orange (opening), cream, mint, blush, sky, cream, custard, cream, mint —
  with espresso ink throughout. Cherry red marks actions only. Burgundy closes the film.
- **Frames**: photographs sit in flat mats with chamfered corners and a mono "Plate n." caption. A thin
  double rule (the one decorative line) sits under chapter headings.
- **Layout**: centred, symmetrical openings; inside each chapter the composition changes (split, filmstrip,
  menu card, postcards). Content column 1100px; equal margins.
- **Motion**: a curtain-opening intro (headline lines rise, the shopfront is revealed by a vertical mask);
  chapter labels, headings and photographs reveal once on scroll; photographs ease in on hover; the chalk sign
  flips and the hours type out beneath it; a little cup rocks in Chapter VI. All of it is off under
  `prefers-reduced-motion`, and nothing is hidden if scripts fail.

## Chapters

0. Opening scene — wordmark, "A very good day for coffee.", Menu / Directions, the chalk sign, Plate 1 (shopfront).
1. Chapter I — Some places are worth slowing down for. (cream; Plate 2, the window at dusk)
2. Chapter II — The Coffee Department. (mint; Plate 3, the latte with the brunch menu)
3. Chapter III — Breakfast is a serious matter. (blush; numbered dishes; Plates 4–5)
4. Chapter IV — Lunch, please. (sky; Plates 6–7)
5. Chapter V — The little things. (cream; a filmstrip of plates, and the two Hairline counter figures)
6. Chapter VI — A very welcome table. (custard; practical reassurance, the rocking cup)
7. Chapter VII — Word from our visitors. (cream; the ratings as postcards)
8. Chapter VIII — The menu. (mint; the full printed card from `menu.json`)
9. Chapter IX — Your table is waiting. Probably. (sky; address, hours, phone, directions)
10. End credits — burgundy footer.
