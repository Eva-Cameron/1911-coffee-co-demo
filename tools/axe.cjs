// node tools/axe.cjs [url]: runs axe-core (WCAG 2.2 AA) at desktop and mobile widths.
const { chromium } = require("playwright");
const axe = require.resolve("axe-core/axe.min.js");
(async () => {
  const b = await chromium.launch();
  for (const w of [1440, 375]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 }, reducedMotion: "reduce" });
    await p.goto(process.argv[2] || "http://localhost:4321/", { waitUntil: "networkidle" });
    await p.addScriptTag({ path: axe });
    const r = await p.evaluate(() => axe.run({ runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] }));
    console.log(`[${w}] violations: ${r.violations.length}`);
    for (const v of r.violations) console.log(` - ${v.id} (${v.impact}): ${v.help}\n   ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`);
    await p.close();
  }
  await b.close();
})();
