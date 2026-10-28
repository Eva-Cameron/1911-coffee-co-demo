// Generates stand-in photos until the client's own photography arrives.
// Run: node tools/placeholders.mjs. Replace the files in src/assets/photos/ with real photos of the same name.
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const out = new URL("../src/assets/photos/", import.meta.url);
mkdirSync(out, { recursive: true });

const ink = "#2D2A26";
const art = {
  // a cup and saucer, seen from above, with a rosetta
  latte: `<circle cx="600" cy="760" r="330" fill="none" stroke="${ink}" stroke-width="5"/>
    <circle cx="600" cy="760" r="220" fill="#C99B6D" stroke="${ink}" stroke-width="5"/>
    <path d="M600 600 C 520 680, 520 820, 600 900 C 680 820, 680 680, 600 600 Z M600 640 V 900" fill="#F6EFE4" stroke="${ink}" stroke-width="4"/>
    <path d="M820 760 h 110 a 40 40 0 0 1 0 80 h -60" fill="none" stroke="${ink}" stroke-width="5"/>`,
  // a full breakfast on a plate
  breakfast: `<circle cx="600" cy="760" r="360" fill="#FFFDF8" stroke="${ink}" stroke-width="5"/>
    <circle cx="470" cy="640" r="85" fill="#FFFDF8" stroke="${ink}" stroke-width="4"/><circle cx="480" cy="635" r="38" fill="#E9A23B" stroke="${ink}" stroke-width="4"/>
    <rect x="600" y="560" width="70" height="250" rx="30" fill="#9A5A35" stroke="${ink}" stroke-width="4" transform="rotate(28 635 685)"/>
    <rect x="690" y="600" width="60" height="220" rx="26" fill="#9A5A35" stroke="${ink}" stroke-width="4" transform="rotate(28 720 710)"/>
    <ellipse cx="500" cy="860" rx="120" ry="70" fill="#C8693A" stroke="${ink}" stroke-width="4"/>
    <circle cx="740" cy="900" r="62" fill="#B8432F" stroke="${ink}" stroke-width="4"/><path d="M700 900 h 80 M740 860 v 80" stroke="${ink}" stroke-width="3"/>`,
  // cake under a glass dome on a stand
  cakes: `<path d="M360 980 h 480 M600 980 v -90 M420 890 h 360" stroke="${ink}" stroke-width="6" fill="none"/>
    <rect x="460" y="740" width="280" height="150" rx="14" fill="#E8C79E" stroke="${ink}" stroke-width="5"/>
    <path d="M460 800 h 280" stroke="${ink}" stroke-width="4"/>
    <path d="M410 890 V 700 a 190 190 0 0 1 380 0 V 890" fill="none" stroke="${ink}" stroke-width="5"/>
    <circle cx="600" cy="490" r="18" fill="none" stroke="${ink}" stroke-width="5"/>`,
  // the shopfront
  story: `<rect x="300" y="420" width="600" height="620" rx="10" fill="#E07B39" stroke="${ink}" stroke-width="5"/>
    <rect x="360" y="560" width="200" height="300" fill="#F6EFE4" stroke="${ink}" stroke-width="4"/>
    <rect x="640" y="560" width="200" height="480" fill="#F6EFE4" stroke="${ink}" stroke-width="4"/>
    <path d="M300 480 h 600" stroke="${ink}" stroke-width="4"/>`,
  // a menu board
  menu: `<rect x="380" y="420" width="440" height="600" rx="16" fill="#FFFDF8" stroke="${ink}" stroke-width="5"/>
    ${[540, 620, 700, 780, 860, 940].map((y) => `<path d="M440 ${y} h 220" stroke="${ink}" stroke-width="5"/><path d="M680 ${y} h 20" stroke="${ink}" stroke-width="5" stroke-dasharray="2 10"/><path d="M720 ${y} h 40" stroke="${ink}" stroke-width="5"/>`).join("")}`,
  // a map pin on a street
  findus: `<path d="M200 820 C 420 760, 780 900, 1000 820" stroke="${ink}" stroke-width="40" fill="none" opacity=".18"/>
    <path d="M600 900 C 520 780, 480 700, 480 620 a 120 120 0 0 1 240 0 c 0 80 -40 160 -120 280 z" fill="#E07B39" stroke="${ink}" stroke-width="5"/>
    <circle cx="600" cy="620" r="44" fill="#F6EFE4" stroke="${ink}" stroke-width="4"/>`,
};
const bg = { latte: "#D8BFA3", breakfast: "#CFB79C", cakes: "#DCC6AC", story: "#C9B39A", menu: "#D3BFA6", findus: "#D9C8B2" };

for (const [name, body] of Object.entries(art)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1500" viewBox="0 0 1200 1500">
    <rect width="1200" height="1500" fill="${bg[name]}"/>
    <g transform="translate(0 0)">${body}</g>
    <text x="600" y="150" text-anchor="middle" font-family="Courier New, monospace" font-size="38" letter-spacing="6" fill="${ink}" opacity=".65">PHOTO TO COME · ${name.toUpperCase()}</text>
  </svg>`;
  await sharp(Buffer.from(svg)).jpeg({ quality: 82 }).toFile(new URL(`${name}.jpg`, out).pathname);
  console.log("wrote", name);
}
