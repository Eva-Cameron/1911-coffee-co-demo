/**
 * Sets off the scroll reveals once each: [data-reveal], [data-lines] and [data-mask].
 * Does nothing unless Layout's inline script set html.motion, so content is never hidden
 * when JavaScript or motion is off.
 */
const root = document.documentElement;

if (root.classList.contains("motion") && "IntersectionObserver" in window) {
  // A masked photograph is clipped to nothing until it opens, and a clipped element has no area
  // to intersect, so its unclipped parent is watched instead and the class lands on the mask.
  const targetOf = new Map<Element, Element>();
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      (targetOf.get(e.target) ?? e.target).classList.add("in");
      io.unobserve(e.target);
    }
  }, { rootMargin: "0px 0px -12% 0px", threshold: 0.05 });

  document.querySelectorAll("[data-reveal], [data-lines]").forEach((el) => io.observe(el));
  document.querySelectorAll("[data-mask]").forEach((el) => {
    const watch = el.parentElement ?? el;
    targetOf.set(watch, el);
    io.observe(watch);
  });

  // A safety net: if anything is still waiting after the page settles at the bottom, show it.
  addEventListener("load", () => setTimeout(() => {
    if (innerHeight + scrollY >= document.body.scrollHeight - 4)
      document.querySelectorAll("[data-reveal]:not(.in), [data-lines]:not(.in), [data-mask]:not(.in)").forEach((el) => el.classList.add("in"));
  }, 1500));
} else {
  root.classList.remove("motion");
}
