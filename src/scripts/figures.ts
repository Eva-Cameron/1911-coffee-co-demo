/**
 * Hosts the Hairline figures on the page. The kernel (public/hairline/kernel.js,
 * unchanged from @lucasmarkes/hairline's skill) is a classic script that sets
 * the HL global; each figure is a module that calls hairline({ … }) once. This
 * does what the skill's bench does for one figure, for every [data-figure] on
 * the page, and plays each figure's tour so the counter moves on its own until
 * a hand arrives. Nothing loads until the section is near the viewport.
 */
type Read = { textContent: string | null };
type FigureDef = {
  name: string;
  means: string;
  range: [number, number, number];
  tour: ([number, number] | null)[] | null;
  mount: (ctx: { stage: HTMLElement; svg: SVGSVGElement; read: Read }, value: number) => { set(v: number): void; destroy(): void };
};
declare global {
  interface Window { HL: any; hairline: (f: FigureDef) => void; }
}

const stages = [...document.querySelectorAll<HTMLElement>("[data-figure]")];
const base = "/hairline/";

function load(src: string, module = false) {
  return new Promise<void>((res, rej) => {
    const s = document.createElement("script");
    s.src = src;
    if (module) s.type = "module";
    s.onload = () => res();
    s.onerror = rej;
    document.body.append(s);
  });
}

window.hairline = (fig) => {
  const stage = stages.find((s) => s.dataset.figure === fig.name);
  if (!stage || stage.dataset.hairline) return;
  const HL = window.HL;
  HL.inject(document);
  stage.setAttribute("data-hairline", fig.name);
  stage.setAttribute("role", "img");
  stage.setAttribute("aria-label", stage.dataset.label || fig.means);
  const svg = HL.mk("svg", { viewBox: "0 0 400 320", "aria-hidden": "true" }, stage);
  const out = document.querySelector<HTMLElement>(`[data-read-for="${fig.name}"]`);
  let text: string | null = null;
  const read: Read = {
    get textContent() { return text; },
    set textContent(v) { text = v == null ? "" : String(v); if (out) out.textContent = text; },
  };
  fig.mount({ stage, svg, read }, fig.range[1]);
  if (text === null) read.textContent = "rest";
  if (fig.tour) HL.tour(stage, fig.tour);
};

if (stages.length) {
  const io = new IntersectionObserver(async (entries) => {
    if (!entries.some((e) => e.isIntersecting)) return;
    io.disconnect();
    await load(base + "kernel.js");
    for (const s of stages) load(`${base}${s.dataset.figure}.js`, true);
  }, { rootMargin: "400px 0px" });
  stages.forEach((s) => io.observe(s));
}
