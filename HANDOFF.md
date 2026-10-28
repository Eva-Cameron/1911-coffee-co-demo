# Handoff: research pass with Claude in Chrome

Paste everything below the line into a Claude session on your own computer, opened in this
repo's folder, with the Claude in Chrome extension connected.

---

You're picking up the 1911 Coffee Co. website: a café at 28–30 Queen Street, Amble, Northumberland.
The site is an Astro static site in this repo. Read `README.md` first, then the Jira tickets
KAN-22 (the build plan) and KAN-4 (the client lead) at evaelizabethcameron.atlassian.net if you
can reach them.

**Where it stands.** The whole one-page site is built and passes an axe WCAG 2.2 AA audit, and
Lighthouse mobile scored 98 for Performance and 100 for the other three. The current look is a
"crisp modern café":
- the brand orange (`#E07B39`) and cream (`#F6EFE4`) from the shopfront and cups;
- one sans family, Bricolage Grotesque, for headings and body, with IBM Plex Mono for labels,
  prices and times;
- white card panels with borders and shadows, filled buttons and tags, and solid Phosphor icons;
- two interactive Hairline line figures (cups and a cake dome) in "On the counter".
The design tokens are all in `src/styles/tokens.css`. Every photo is a labelled stand-in.

**What the owner (Eva) wants from this pass.** She thinks the site still feels too geometric.
She wants better styling references, better fonts, better line art and real photography. Use
Chrome for research the cloud session couldn't do, because its network blocked these sites.

1. **Reference layouts.** Open the two reference projects from KAN-22 and study their layout,
   spacing, type pairing and motion:
   - A: https://www.behance.net/gallery/250863357/Coffee-Shop-Website-Brand-Identity-UIUX-Design
     (framed cream card, centred badge nav, tilted photo trio). The current build follows this.
   - B: https://www.behance.net/gallery/253599493/Coffee-Shop-Website-Design-UIUX
     (cream ground, spaced caps hero, Story / Menu / Locations photo tiles).

   Then find three to five more independent-café sites or Behance/Dribbble shots with warmth and
   hand-made character that still feel crisp, not editorial-serif and not geometric. Take
   screenshots into `research/` (it's gitignored) and write `research/NOTES.md`: for each one,
   the link, what to borrow, and what to avoid.

2. **Fonts.** On Google Fonts, shortlist two or three display faces with more hand than
   Bricolage Grotesque: rounded, slab, or lightly hand-lettered, that still read crisp. Pair each
   with a clean body sans (or keep Bricolage for body). Check each one exists on Fontsource,
   because the site self-hosts fonts through `@fontsource` and makes no Google Fonts request.
   Mock the hero headline in each so Eva can choose. Don't switch the site's fonts until she
   picks.

3. **Line art.** The sprigs (`src/components/Sprig.astro`) and the roundel
   (`src/components/Roundel.astro`) are hand-coded SVG and look too mechanical. Look at
   hand-drawn café and botanical line illustration for stroke weight, line wobble and how much
   detail to show. Propose a direction, then redraw the sprigs as original SVG. Don't trace or
   copy anyone's artwork. The Hairline figures in `figures/` follow Hairline's own rules
   (https://hairline.lucasmarkes.com). Only change them through the hairline-create skill.

4. **Photos.**
   - Look at 1911 Coffee Co.'s own Instagram and Facebook to learn what the shop, the food and
     the shopfront really look like. Use that to brief the photos and to check the colours.
   - Don't put their photos, or any screenshot of anyone's work, into the site without the
     owner's written permission. KAN-22's IP rule says never reuse the reference designers'
     images, illustrations, logos or copy.
   - Until real photos arrive, you may use properly licensed stock (Unsplash or Pexels), as
     long as it matches the real shop (orange shopfront, oak counter, cakes under glass domes,
     latte art). Record each photo's source link and licence in `src/assets/photos/CREDITS.md`.
   - Keep the file names in `src/assets/photos/`: latte, breakfast, cakes, story, menu and
     findus `.jpg`. The site picks them up automatically.

5. **Report back.** Summarise what you found and recommend one direction, with screenshots.
   Wait for Eva to choose before you restyle. Once she's chosen, make the change on a branch,
   then:
   - run `npm run build`;
   - check 375, 768 and 1440px for horizontal scroll;
   - run `node tools/axe.cjs` against `npx astro preview` (it must report 0 violations);
   - re-run Lighthouse mobile.

**Rules that still apply.**
- Every text colour must keep 4.5:1 contrast. Orange is for fills only, never text on cream; use
  `--ember` for accent text.
- Respect `prefers-reduced-motion`, and keep focus visible.
- Don't invent facts about the business: hours, suppliers, history, accessibility, reviews.
  Anything unconfirmed stays marked "(to confirm)" and is listed in the README's placeholder
  list.
- Reviews must be real quotes, used with each reviewer's permission.
