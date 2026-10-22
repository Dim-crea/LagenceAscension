"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Steps scroll sideways while the section stays pinned (desktop); a plain stack on mobile.
export default function Method({ steps }) {
  const root = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const track = root.current.querySelector(".ag_track");
      const bar = root.current.querySelector(".ag_method-bar i");
      const dist = () => Math.max(track.scrollWidth - window.innerWidth, 0);
      const tween = gsap.to(track, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${dist()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => gsap.set(bar, { scaleX: self.progress }),
        },
      });
      return () => tween.kill();
    });
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    return () => mm.revert();
  }, []);

  return (
    <section className="ag_method" ref={root}>
      <div className="ag_method-head padding-global">
        <div className="container-large">
          <p className="club_eyebrow">Notre méthode</p>
        </div>
      </div>
      <div className="ag_track">
        {steps.map((s, i) => (
          <article className="ag_step" key={s.title}>
            <span className="ag_step-n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
            <h2 className="hd-50">{s.title}</h2>
            <p className="t-20">{s.text}</p>
          </article>
        ))}
      </div>
      <div className="ag_method-bar" aria-hidden="true"><i /></div>
    </section>
  );
}
