/**
 * Cups: five drinks on saucers along an oak counter, each its own size: a
 * short espresso, a handleless cortado glass, a wide flat white, a tall latte,
 * a big mocha. The cup under the pointer lifts off its saucer and its
 * neighbours rise a little after it, staggered outwards. Handles point every
 * which way at rest, and a crema dot on the flat white is where the eye starts.
 * The slider is the stagger, in ms.
 *
 * The pattern: one of many (Riffle). Tweens, a stagger by distance, and a hit
 * test on each cup's rest centre along the row, so a lifting cup cannot flip it.
 */
const {
  Cam, clamp, circ, facing, fit, hull, open, poly, proj, rad, ringAt, rings, prism, run,
  tdone, tset, tval, tween, disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

// n: name · rf/rt: foot and rim radius · h: height · s: saucer radius · phi: handle bearing (null: a glass)
const CUPS = [
  { n: "espresso", rf: 4.6, rt: 6.4, h: 8, s: 10.5, phi: 150 },
  { n: "cortado", rf: 5.4, rt: 7, h: 12, s: 11, phi: null },
  { n: "flat white", rf: 6.4, rt: 10, h: 9.5, s: 14, phi: 320 },
  { n: "latte", rf: 7, rt: 9.4, h: 18, s: 14, phi: 165 },
  { n: "mocha", rf: 7.6, rt: 11.4, h: 13, s: 15.5, phi: 300 },
];
const SH = 1.6, LIFT = 24, NEAR = [1, 0.3, 0.08], REST_MARK = 2, BY = 20;
// the handle, as [offset out from the wall, share of the cup's height]: outer edge down, then inner edge back up
const HANDLE = [[0, 0.84], [4.4, 0.9], [7, 0.7], [6.6, 0.4], [4, 0.18], [0, 0.2], [0, 0.36], [3, 0.36], [4.4, 0.52], [3.8, 0.7], [0, 0.68]];

const at = (ring, cx) => ring.map((q) => ({ u: q.u + cx, v: q.v, nu: q.nu, nv: q.nv }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;

  let x = 0;
  CUPS.forEach((c, i) => { if (i) x += CUPS[i - 1].s + c.s + 4; c.cx = x; });
  const X0 = -CUPS[0].s - 9, X1 = x + CUPS[CUPS.length - 1].s + 9;

  const C = Cam(45, 0.5, 2.1);
  fit(C, [[X0, -BY, -6], [X1, BY, -6], [X1, -BY, 0], [X0, BY, 0], [CUPS[3].cx, 0, SH + LIFT + CUPS[3].h], [CUPS[4].cx, 0, SH + LIFT + CUPS[4].h]], 200, 172);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const [br, bi] = rings(X0, -BY, X1, BY, 12, 2);
  put(solid(g), prism(P, front, br, bi, -6, 0));
  mk("path", { d: open(ringAt(P, run(rings(X0 + 6, -BY + 6, X1 - 6, BY - 6, 8, 0)[0], (q) => !front(q)), 0)), class: "nf lo" }, g);

  const cups = CUPS.map((c, i) => {
    const grp = mk("g", {}, g);
    const sau = solid(grp);
    put(sau, prism(P, front, at(circ(c.s, 40), c.cx), at(circ(c.s - 1.8, 40), c.cx), 0, SH));
    mk("path", { d: poly(ringAt(P, at(circ(c.rf + 1.2, 32), c.cx), SH)), class: "nf lo" }, grp);
    const near = c.phi !== null && front({ nu: Math.cos(rad(c.phi)), nv: Math.sin(rad(c.phi)) });
    const handle = c.phi === null ? null : mk("path", { class: "sil" }, grp);
    const body = mk("path", { class: "sil" }, grp);
    if (handle && near) body.after(handle);
    const rim = mk("path", { class: "nf" }, grp), coffee = mk("path", { class: "nf lo" }, grp);
    const dot = flatDot(grp, C, 1.1, i === REST_MARK ? "dot" : "dot off");
    return { ...c, i, handle, body, rim, coffee, dot, z: tween(0), drawn: NaN,
      foot: at(circ(c.rf, 40), c.cx), top: at(circ(c.rt, 40), c.cx), lip: at(circ(c.rt - 0.9, 40), c.cx), cof: at(circ(c.rt - 2.2, 40), c.cx) };
  });

  function draw(c, lift) {
    if (lift === c.drawn) return;
    c.drawn = lift;
    const z0 = SH + lift, z1 = z0 + c.h;
    c.body.setAttribute("d", poly(hull(ringAt(P, c.foot, z0).concat(ringAt(P, c.top, z1)))));
    c.rim.setAttribute("d", poly(ringAt(P, c.lip, z1)));
    c.coffee.setAttribute("d", open(ringAt(P, run(c.cof, (q) => !front(q)), z1 - 1.4)));
    place(c.dot, P(c.cx, 0, z1 - 1.4));
    if (c.handle) {
      const ca = Math.cos(rad(c.phi)), sa = Math.sin(rad(c.phi));
      c.handle.setAttribute("d", poly(HANDLE.map(([o, f]) => {
        const r = c.rf + (c.rt - c.rf) * f + o - 0.4;
        return P(c.cx + r * ca, r * sa, z0 + f * c.h);
      })));
    }
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const c of cups) { draw(c, tval(c.z, now)); if (!tdone(c.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  // hit test: the cup whose resting centre is nearest the pointer along the row, within the counter's band
  const centre = cups.map((c) => P(c.cx, 0, SH + c.h / 2));
  function hit([sx, sy]) {
    let best = -1, d = 1e9;
    cups.forEach((c, i) => {
      const dx = Math.abs(sx - centre[i][0]), dy = Math.abs(sy - centre[i][1]);
      if (dx < c.s * C.S * 1.2 && dy < 42 && dx < d) { d = dx; best = i; }
    });
    return best;
  }

  let act = -1;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    cups.forEach((c, i) => {
      const k = Math.abs(i - from);
      tset(c.z, a < 0 ? 0 : LIFT * (NEAR[Math.abs(i - a)] ?? 0), now, k * stag);
      c.body.classList.toggle("hi", i === a);
      c.dot.setAttribute("class", i === a || (a < 0 && i === REST_MARK) ? "dot" : "dot off");
    });
    read.textContent = a < 0 ? "rest" : cups[a].n;
    B.wake();
  }

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { stag = clamp(v, 0, 200); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "cups",
  means: "Five drinks on saucers along a counter: the cup under the pointer lifts off its saucer, and its neighbours rise after it.",
  rules: [1, 2, 5, 8],
  range: [0, 45, 100],
  tour: [[150, 120], [230, 160], [290, 190], null],
  mount,
});
