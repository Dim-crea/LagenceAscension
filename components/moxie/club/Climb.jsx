"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ALT_FROM = 2000;
const ALT_TO = 8848;
const fmt = (n) => Math.round(n).toLocaleString("fr-FR").replace(/\s/g, " ");

// The four levels, stacked down the right-hand side (level 1 top-right → level 4 bottom-right).
// A line runs down the left of the cards while a climber dot follows it; each level lights up as it is reached,
// and the altitude counter on the left climbs with the scroll.
export default function Climb({ pillars }) {
  const root = useRef(null);
  const items = pillars.slice(0, 4);

  useEffect(() => {
    const stage = root.current.querySelector(".climb_stage");
    const list = stage.querySelector(".climb_list");
    const svg = stage.querySelector("svg");
    const path = svg.querySelector("path");
    const dot = svg.querySelector("circle");
    const alt = stage.querySelector(".climb_alt-value");
    const cards = [...stage.querySelectorAll(".climb_card")];
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let st;
    let len = 0;
    let marks = [];

    const build = () => {
      const sr = stage.getBoundingClientRect();
      svg.setAttribute("viewBox", `0 0 ${sr.width} ${sr.height}`);
      const x = list.getBoundingClientRect().left - sr.left + (window.innerWidth >= 768 ? -28 : 6);
      const tops = cards.map((c) => c.getBoundingClientRect().top - sr.top);
      const y0 = tops[0];
      const y1 = tops[tops.length - 1];
      path.setAttribute("d", `M ${x} ${y0} V ${y1}`);
      len = y1 - y0;
      path.style.strokeDasharray = `${len}`;
      path.style.strokeDashoffset = reduced ? "0" : `${len}`;
      marks = tops.map((t) => (len ? (t - y0) / len : 0));
    };

    const update = (p) => {
      path.style.strokeDashoffset = `${len * (1 - p)}`;
      const pt = path.getPointAtLength(len * p);
      dot.setAttribute("cx", pt.x);
      dot.setAttribute("cy", pt.y);
      alt.textContent = fmt(ALT_FROM + (ALT_TO - ALT_FROM) * p);
      cards.forEach((c, i) => c.classList.toggle("is-on", p >= marks[i] - 0.02));
    };

    const init = () => {
      st?.kill();
      build();
      if (reduced) {
        cards.forEach((c) => c.classList.add("is-on"));
        dot.setAttribute("r", 0);
        alt.textContent = fmt(ALT_TO);
        return;
      }
      update(0);
      st = ScrollTrigger.create({
        trigger: list,
        start: "top 60%",
        end: "bottom 70%",
        scrub: 0.8,
        onUpdate: (self) => update(self.progress),
      });
    };

    init();
    let t;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(init, 250);
    };
    window.addEventListener("resize", onResize);
    document.fonts?.ready.then(init);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
      st?.kill();
    };
  }, [items.length]);

  return (
    <section className="club_climb" ref={root}>
      <div className="padding-global padding-section-large">
        <div className="container-large">
          <div className="climb_stage">
            <svg className="climb_line" aria-hidden="true">
              <path fill="none" stroke="currentColor" strokeWidth="1.2" />
              <circle r="5" fill="#fff" />
            </svg>
            <div className="climb_side">
              <p className="club_eyebrow">Les 4 niveaux</p>
              <h2 className="hd-50">
                Un club, <em>quatre</em> paliers pour s'élever
              </h2>
              <p className="climb_alt" aria-hidden="true">
                <span className="climb_alt-value">{fmt(ALT_FROM)}</span> <span className="climb_alt-unit">m</span>
              </p>
            </div>
            <div className="climb_list">
              {items.map((p, i) => (
                <article className="climb_card" key={p.title}>
                  <span className="climb_lvl">Niveau {String(i + 1).padStart(2, "0")}</span>
                  <h3 className="hd-32">{p.title}</h3>
                  <p className="t-18">{p.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
