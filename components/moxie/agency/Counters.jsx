"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// "6+" → counts 0 → 6 and keeps the suffix; values without a leading number (e.g. "4K") count the number and keep "K".
export default function Counters({ stats }) {
  const root = useRef(null);

  useEffect(() => {
    const nodes = root.current.querySelectorAll("[data-count]");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      nodes.forEach((n) => {
        const target = Number(n.dataset.count);
        const suffix = n.dataset.suffix;
        if (reduced || !Number.isFinite(target)) return;
        const o = { v: 0 };
        n.textContent = `0${suffix}`;
        gsap.to(o, {
          v: target,
          duration: 1.8,
          ease: "power3.out",
          scrollTrigger: { trigger: n, start: "top 85%", once: true },
          onUpdate: () => (n.textContent = `${Math.round(o.v)}${suffix}`),
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="ag_stats" ref={root}>
      <div className="padding-global">
        <div className="container-large ag_stats-grid">
          {stats.map((s) => {
            const m = String(s.value).match(/^(\d+)(.*)$/);
            return (
              <div className="ag_stat" key={s.label}>
                <p className="ag_stat-value" data-count={m ? m[1] : undefined} data-suffix={m ? m[2] : ""}>
                  {s.value}
                </p>
                <p className="t-14 ag_stat-label">{s.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
