"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

// Two kinetic rows of giant words. They run faster and skew with the scroll velocity.
export default function Audience({ words }) {
  const root = useRef(null);
  const list = words.length ? words : ["Entrepreneurs"];

  useEffect(() => {
    const rows = root.current.querySelectorAll(".aud_row");
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tweens = [];
    rows.forEach((row, i) => {
      const inner = row.firstElementChild;
      gsap.set(inner, { xPercent: i % 2 ? -50 : 0 });
      tweens.push(gsap.to(inner, { xPercent: i % 2 ? 0 : -50, duration: 38 + i * 6, ease: "none", repeat: -1 }));
    });
    let last = window.scrollY;
    let v = 0;
    const skew = gsap.quickTo(rows, "skewX", { duration: 0.5, ease: "power3.out" });
    const loop = () => {
      const y = window.scrollY;
      v = v * 0.9 + (y - last) * 0.1;
      last = y;
      tweens.forEach((t) => t.timeScale(1 + Math.min(Math.abs(v) * 0.35, 8)));
      skew(Math.max(-10, Math.min(10, -v * 0.6)));
    };
    gsap.ticker.add(loop);
    return () => {
      gsap.ticker.remove(loop);
      tweens.forEach((t) => t.kill());
    };
  }, []);

  const chunk = (k) =>
    [0, 1, 2].map((n) => (
      <span className="aud_chunk" key={`${k}-${n}`}>
        {list.map((w, i) => (
          <span key={w} className="aud_item">
            <span className={`aud_word serif${(i + k) % 2 ? " is-it" : ""}`}>{w}</span>
            <span className="aud_sep" aria-hidden="true">✦</span>
          </span>
        ))}
      </span>
    ));

  return (
    <section className="club_audience" ref={root}>
      <div className="padding-global">
        <p className="club_eyebrow">Pour qui ?</p>
      </div>
      <div className="aud_row"><div className="aud_inner">{chunk(0)}{chunk(0)}</div></div>
      <div className="aud_row"><div className="aud_inner">{chunk(1)}{chunk(1)}</div></div>
    </section>
  );
}
