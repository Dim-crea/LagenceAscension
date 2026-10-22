"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { renderEm } from "@/lib/rich";

// Rotating badge with a magnetic call-to-action.
export default function Engagement({ text }) {
  const wrap = useRef(null);
  const btn = useRef(null);

  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const w = wrap.current;
    const b = btn.current;
    const x = gsap.quickTo(b, "x", { duration: 0.7, ease: "elastic.out(1, 0.5)" });
    const y = gsap.quickTo(b, "y", { duration: 0.7, ease: "elastic.out(1, 0.5)" });
    const move = (e) => {
      const r = b.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      if (Math.hypot(dx, dy) < 160) {
        x(dx * 0.4);
        y(dy * 0.4);
        w.classList.add("is-near");
      } else {
        x(0);
        y(0);
        w.classList.remove("is-near");
      }
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  const go = () => {
    document.getElementById("rejoindre")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="club_engagement" ref={wrap}>
      <div className="padding-global padding-section-large">
        <div className="container-large club_engagement-inner">
          <h2 className="hd-60 club_engagement-text">{renderEm(text)}</h2>
          <div className="club_badge">
            <svg viewBox="0 0 240 240" className="club_badge-ring" aria-hidden="true">
              <defs>
                <path id="clubCircle" d="M 120,120 m -96,0 a 96,96 0 1,1 192,0 a 96,96 0 1,1 -192,0" />
              </defs>
              <text>
                <textPath href="#clubCircle">CLUB ASCENSION • MONTER ENSEMBLE • CLUB ASCENSION • MONTER ENSEMBLE • </textPath>
              </text>
            </svg>
            <button ref={btn} type="button" className="club_badge-btn" onClick={go}>
              Rejoindre
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
