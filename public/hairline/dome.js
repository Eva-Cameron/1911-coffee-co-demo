/**
 * Dome: a two-layer cake on a footed stand under a glass cloche. The pointer's
 * height lifts the cloche off the plate, and it follows on a spring. At rest it
 * sits a finger's width up, so a sliver of light shows under its lip, and the
 * knob is where the eye starts; lifted past half way, the glass takes the
 * bright edge instead. The glass is drawn without fill, so the cake shows
 * through it. The slider is how far the cloche can lift.
 *
 * The pattern: a continuous input on a spring (Laptop's lid), read from the
 * pointer's height on the screen, which no drawing can move out from under it.
 */
const {
  Cam, clamp, circ, facing, fit, hull, open, poly, proj, rad, ringAt, prism, run, spring, stepS,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const PLATE = 34, PZ = 15, CR = 19, CH = 15, RD = 27.5, HD = 30, REST = 4, LMAX = 36;
const ARC = Array.from({ length: 16 }, (_, i) => i * 6);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;

  const C = Cam(45, 0.5, 2.85);
  fit(C, [[-PLATE, -PLATE, 0], [PLATE, PLATE, 0], [PLATE, -PLATE, 0], [-PLATE, PLATE, 0], [0, 0, PZ + LMAX + HD + 7]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the stand: a tapered foot, a stem, a plate
  const foot = circ(15, 48), footTop = circ(9, 48);
  put(solid(g), { sil: poly(hull(ringAt(P, foot, 0).concat(ringAt(P, footTop, 3)))), crease: open(ringAt(P, run(circ(8, 48), front), 3)) });
  put(solid(g), prism(P, front, circ(3, 24), null, 3, PZ - 1.6));
  put(solid(g), prism(P, front, circ(PLATE, 72), circ(PLATE - 2, 72), PZ - 1.6, PZ));

  // the cloche's far lip goes behind the cake
  const backLip = mk("path", { class: "nf lo" }, g);

  // the cake: two sponges and a line of filling, berries on top
  put(solid(g), prism(P, front, circ(CR, 64), circ(CR - 1.4, 64), PZ, PZ + CH));
  mk("path", { d: open(ringAt(P, run(circ(CR, 64), front), PZ + CH * 0.48)), class: "nf lo" }, g);
  [[-6, -4, "dot m"], [4, -7, "dot off"], [7, 3, "dot m"], [-2, 6, "dot off"], [0, -0.5, "dot m"]].forEach(([x, y, cls]) =>
    place(flatDot(g, C, 1.5, cls), P(x, y, PZ + CH)));

  // the cloche: rings up a quarter ellipse, hulled; no fill, it is glass
  const glass = mk("path", { class: "nf sil" }, g);
  const frontLip = mk("path", { class: "nf" }, g);
  const glint = mk("path", { class: "nf lo" }, g);
  const knob = solid(g), stem = solid(g);
  knob.g.before(stem.g);
  const lip = circ(RD, 72);
  const rings = ARC.map((a) => ({ ring: circ(Math.max(0.6, RD * Math.cos(rad(a))), 64), z: HD * Math.sin(rad(a)) }));

  let drawn = NaN;
  function draw(L) {
    if (L === drawn) return;
    drawn = L;
    const zb = PZ + L;
    glass.setAttribute("d", poly(hull(rings.flatMap((r) => ringAt(P, r.ring, zb + r.z)))));
    backLip.setAttribute("d", open(ringAt(P, run(lip, (q) => !front(q)), zb)));
    frontLip.setAttribute("d", open(ringAt(P, run(circ(RD - 1.6, 72), front), zb + 1.2)));
    // a highlight on the glass, up its left shoulder
    glint.setAttribute("d", open([28, 36, 44, 52, 60].map((a) => {
      const r = RD * Math.cos(rad(a)) - 2.5, b = rad(105);
      return P(r * Math.cos(b), r * Math.sin(b), zb + HD * Math.sin(rad(a)) - 0.6);
    })));
    put(stem, prism(P, front, circ(1.6, 16), null, zb + HD - 0.5, zb + HD + 3));
    put(knob, prism(P, front, circ(4.2, 24), circ(3.2, 24), zb + HD + 3, zb + HD + 6.5));
  }

  const sp = spring(REST, { eps: 0.03 });
  const B = register(stage, (dt) => {
    const m = stepS(sp, dt);
    draw(Math.max(0, sp.x));
    const up = sp.t > LMAX * reach * 0.45;
    glass.classList.toggle("hi", up);
    knob.sil.classList.toggle("hi", !up);
    return m;
  });
  bag.add(B.unregister);

  let over = null;
  function retarget() {
    sp.t = over === null ? REST : Math.max(REST * 0.5, LMAX * reach * clamp((290 - over) / 200, 0, 1));
    read.textContent = over === null ? "rest" : `lift ${Math.round(sp.t)}`;
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => { over = p[1]; retarget(); },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { reach = clamp(v, 0, 1); retarget(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "dome",
  means: "A cake under a glass cloche: the pointer's height lifts the cloche off the stand, and it follows on a spring.",
  rules: [1, 3, 5, 6, 8],
  range: [0.4, 0.7, 1],
  tour: [[200, 250], [200, 90], [220, 170], null],
  mount,
});
