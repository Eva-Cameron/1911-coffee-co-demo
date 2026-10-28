// node tools/shoot.mjs <outDir> [url]: full-page screenshots at four widths, plus console errors.
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright");
const [out, url = "http://localhost:4321/"] = process.argv.slice(2);
const browser = await chromium.launch();
for (const w of [1440, 1024, 768, 375]) {
  const page = await browser.newPage({ viewport: { width: w, height: 900 } });
  page.on("console", (m) => m.type() === "error" && console.log(`[${w}] console:`, m.text()));
  page.on("pageerror", (e) => console.log(`[${w}] pageerror:`, e.message));
  await page.goto(url, { waitUntil: "networkidle" });
  // scroll through so observers fire, then settle
  for (let y = 0; y < 12000; y += 500) { await page.mouse.wheel(0, 500); await page.waitForTimeout(120); }
  await page.waitForTimeout(2500);
  const sw = await page.evaluate(() => document.documentElement.scrollWidth);
  if (sw > w) console.log(`[${w}] horizontal overflow: ${sw}px`);
  await page.screenshot({ path: `${out}/page-${w}.png`, fullPage: true, animations: "disabled" });
  await page.close();
}
await browser.close();
