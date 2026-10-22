"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

// The italic phrase that swaps in place (Moxie's "marque span"): measured to the widest phrase,
// the next one rises in while the current one fades out.
export default function RotatingWord({ words, className = "", left = false }) {
  const root = useRef(null);

  useEffect(() => {
    const container = root.current;
    if (!container || words.length < 2) return;
    let killed = false;
    let tl;
    const initial = container.querySelector("[data-initial]");
    let items = [initial];
    let created = [];
    let index = 0;

    const build = () => {
      created.forEach((i) => i.remove());
      created = [];
      items = [initial];
      container.style.width = "";
      const measure = document.createElement("span");
      measure.style.cssText = "position:absolute;white-space:nowrap;visibility:hidden";
      measure.style.font = getComputedStyle(container).font;
      document.body.appendChild(measure);
      let max = 0;
      words.forEach((w) => {
        measure.textContent = w;
        max = Math.max(max, measure.offsetWidth);
      });
      document.body.removeChild(measure);
      // On narrow screens a long phrase may exceed the container: let it wrap by not forcing nowrap width.
      container.style.width = `${Math.ceil(max) + 2}px`;
      gsap.set(initial, { opacity: 1, yPercent: 0 });
      words.slice(1).forEach((w) => {
        const span = document.createElement("span");
        span.className = "marque-item";
        span.textContent = w;
        gsap.set(span, { opacity: 0, yPercent: 20 });
        container.appendChild(span);
        created.push(span);
        items.push(span);
      });
      index = 0;
    };

    const next = () => {
      if (killed) return;
      const current = items[index];
      const ni = (index + 1) % items.length;
      const nxt = items[ni];
      tl = gsap
        .timeline({ onComplete: () => { index = ni; next(); } })
        .to(nxt, { opacity: 1, yPercent: 0, duration: 1.2, ease: "power2.inOut" })
        .to(current, { opacity: 0, duration: 1, ease: "power2.inOut" }, "<+=0.1")
        .addPause("+=1.2")
        .set(current, { yPercent: 20 });
    };

    const start = () => {
      tl?.kill();
      build();
      gsap.delayedCall(1, next);
    };
    const t = setTimeout(start, 350);
    let w = window.innerWidth >= 768;
    const onResize = () => {
      const now = window.innerWidth >= 768;
      if (now !== w) {
        w = now;
        gsap.killTweensOf(items);
        tl?.kill();
        start();
      }
    };
    window.addEventListener("resize", onResize);
    return () => {
      killed = true;
      clearTimeout(t);
      tl?.kill();
      gsap.killTweensOf(items);
      window.removeEventListener("resize", onResize);
      created.forEach((i) => i.remove());
      gsap.set(initial, { clearProps: "all" });
      container.style.width = "";
    };
  }, [words]);

  return (
    <span ref={root} className={`marque-span ${left ? "is-left" : ""} ${className}`}>
      <span className="marque-span-default">{words[0]}</span>
      <span className="marque-item" aria-hidden="false" data-initial="true" style={{ position: "absolute", left: 0, top: 0, width: "100%", whiteSpace: "nowrap" }}>
        {words[0]}
      </span>
    </span>
  );
}
