// node tools/scenes.cjs <outDir> [width] [url]: viewport screenshots of the hero and each chapter,
// plus console errors, failed requests and horizontal overflow. Needs `npx astro preview` running.
const { chromium } = require("playwright");
const [out, w = "1440", url = "http://localhost:4321/"] = process.argv.slice(2);
const H = +w < 800 ? 844 : 900;
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: +w, height: H } });
  const errs = [];
  p.on("console", (m) => ["error", "warning"].includes(m.type()) && errs.push(m.text()));
  p.on("pageerror", (e) => errs.push(e.message));
  p.on("requestfailed", (r) => errs.push("failed " + r.url()));
  await p.goto(url, { waitUntil: "networkidle" });
  await p.waitForTimeout(2200);
  await p.screenshot({ path: `${out}/${w}-00-hero.png` });
  const ids = await p.evaluate(() => [...document.querySelectorAll("main > section[id]")].map((s) => s.id).filter((i) => i !== "top"));
  let n = 1;
  for (const id of ids) {
    const tag = `${w}-${String(n++).padStart(2, "0")}-${id}`;
    await p.evaluate((i) => document.getElementById(i).scrollIntoView({ block: "start" }), id);
    await p.waitForTimeout(1800);
    await p.screenshot({ path: `${out}/${tag}.png` });
    const h = await p.evaluate((i) => document.getElementById(i).getBoundingClientRect().height, id);
    for (let k = 1; h > (k + 0.4) * H && k < 4; k++) {
      await p.evaluate(() => scrollBy(0, innerHeight * 0.9));
      await p.waitForTimeout(1200);
      await p.screenshot({ path: `${out}/${tag}-${k}.png` });
    }
  }
  await p.evaluate(() => scrollTo(0, document.body.scrollHeight));
  await p.waitForTimeout(1500);
  await p.screenshot({ path: `${out}/${w}-99-footer.png` });
  const sw = await p.evaluate(() => document.documentElement.scrollWidth);
  console.log(`[${w}] overflow: ${sw > +w ? sw + "px" : "none"}; errors: ${errs.length ? "\n  " + errs.join("\n  ") : "none"}`);
  await b.close();
})();
