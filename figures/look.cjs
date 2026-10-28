// Takes the eight look pictures for a bench page, as look.md lists them: node look.cjs <name> <answer x,y> <low x,y> <high x,y>
const { chromium } = require("playwright");
const path = require("path");
const [name, ans, lo, hi] = process.argv.slice(2);
const file = "file://" + path.resolve(`hairline-${name}.html`);
const shots = { rest: "", answer: `at=${ans}`, small: "w=240", "small-answer": `w=240&at=${ans}`, low: `intensity=0&at=${lo}`, high: `intensity=1&at=${hi}`, dark: `theme=dark&at=${ans}`, light: `theme=light&at=${ans}` };
(async () => {
  const b = await chromium.launch();
  for (const [k, q] of Object.entries(shots)) {
    const p = await b.newPage({ viewport: { width: 800, height: 900 }, deviceScaleFactor: 2 });
    const errs = [];
    p.on("console", (m) => ["error", "warning"].includes(m.type()) && errs.push(m.text()));
    p.on("pageerror", (e) => errs.push(e.message));
    await p.goto(file + (q ? "?" + q : ""));
    await p.waitForTimeout(2200);
    const info = await p.evaluate(() => {
      const svg = document.querySelector("#stage svg"), bb = svg.getBBox();
      return { read: document.getElementById("read").textContent, err: document.getElementById("error").textContent, box: [bb.x, bb.y, bb.x + bb.width, bb.y + bb.height].map(Math.round), text: svg.querySelectorAll("text").length };
    });
    const out = info.box[0] < 0 || info.box[1] < 0 || info.box[2] > 400 || info.box[3] > 320;
    console.log(k.padEnd(13), "read:", JSON.stringify(info.read), "box:", info.box.join(","), out ? "LEAVES FRAME" : "", info.err ? "ERROR " + info.err : "", errs.length ? "CONSOLE " + errs.join(" | ") : "");
    await p.locator(".plate").screenshot({ path: `look-${name}-${k}.png` });
    await p.close();
  }
  await b.close();
})();
