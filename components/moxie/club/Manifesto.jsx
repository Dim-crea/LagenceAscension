"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Pinned manifesto: the words light up one after another as you scroll, as if you were climbing the text.
export default function Manifesto({ label, text }) {
  const root = useRef(null);
  const tokens = [];
  String(text)
    .split("*")
    .forEach((seg, i) =>
      seg.split(/\s+/).filter(Boolean).forEach((w) => tokens.push({ w, em: i % 2 === 1 }))
    );

  useEffect(() => {
    const el = root.current;
    const words = el.querySelectorAll(".manifesto_word");
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(words, { opacity: 1 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.set(words, { opacity: 0.14 });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top top", end: () => `+=${Math.max(window.innerHeight * 1.6, 700)}`, pin: true, scrub: 0.6, anticipatePin: 1 },
      });
      tl.to(words, { opacity: 1, stagger: 0.12, ease: "none", duration: 0.12 });
      tl.fromTo(".manifesto_bar i", { scaleX: 0 }, { scaleX: 1, ease: "none", duration: tl.duration() }, 0);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="club_manifesto" ref={root}>
      <div className="padding-global">
        <div className="container-medium">
          <p className="club_eyebrow">{label}</p>
          <p className="manifesto_text serif">
            {tokens.map((t, i) => (
              <span key={i} className={`manifesto_word${t.em ? " is-em" : ""}`}>{t.w} </span>
            ))}
          </p>
          <div className="manifesto_bar" aria-hidden="true"><i /></div>
        </div>
      </div>
    </section>
  );
}
