/**
 * Scroll-triggered motion: typewriter lines, reveals, ink-in headings and the
 * stamp. Does nothing unless Layout's inline script set html.motion.
 */
const root = document.documentElement;

/** Strikes an element's text one character at a time. Screen readers get the whole line at once. */
function typewrite(el: HTMLElement) {
  const text = el.textContent ?? "";
  const speed = Number(el.dataset.typeSpeed ?? 38);
  el.classList.add("typing");
  el.textContent = "";
  const whole = document.createElement("span");
  whole.className = "visually-hidden";
  whole.textContent = text;
  el.append(whole);
  const chars = [...text].map((ch) => {
    const s = document.createElement("span");
    s.className = "tw-char";
    s.setAttribute("aria-hidden", "true");
    s.textContent = ch;
    el.append(s);
    return s;
  });
  const caret = document.createElement("span");
  caret.className = "tw-caret";
  caret.setAttribute("aria-hidden", "true");
  el.append(caret);

  let i = 0, last = 0;
  // A typist's rhythm: slower after spaces and punctuation, never perfectly even.
  const gap = (ch: string) => speed * (/[\s·—,.]/.test(ch) ? 2.2 : 0.7 + Math.random() * 0.6);
  let wait = 300;
  const step = (now: number) => {
    if (!last) last = now;
    if (now - last >= wait) {
      chars[i].classList.add("on");
      chars[i].after(caret);
      wait = gap(chars[i].textContent ?? "");
      last = now;
      i++;
    }
    if (i < chars.length) requestAnimationFrame(step);
    else caret.classList.add("done");
  };
  requestAnimationFrame(step);
}

if (root.classList.contains("motion")) {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const el = e.target as HTMLElement;
      io.unobserve(el);
      if (el.matches("[data-type]")) typewrite(el);
      else el.classList.add("in");
    }
  }, { rootMargin: "0px 0px -10% 0px" });

  document.querySelectorAll<HTMLElement>("[data-type], [data-reveal], .ink, .stamp, .menu-row")
    .forEach((el) => io.observe(el));
}
