"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ClubSky from "@/components/moxie/club/ClubSky";

// Title letters rise one by one; the italic word then floats and glows, like it is lifting off.
export default function ClubHero({ title, subtitle }) {
  const root = useRef(null);
  const parts = String(title).split("*");

  useEffect(() => {
    const el = root.current;
    const chars = el.querySelectorAll(".char");
    const accent = el.querySelector(".club_title em");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      gsap.set(chars, { yPercent: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });
      tl.fromTo(chars, { yPercent: 115, rotate: 6 }, { yPercent: 0, rotate: 0, duration: 1.1, ease: "power4.out", stagger: 0.045 })
        .fromTo(".club_hero-sub", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" }, "-=0.5")
        .fromTo(".club_cue", { opacity: 0 }, { opacity: 1, duration: 0.8 }, "-=0.3");
      if (accent) {
        gsap.to(accent, { y: -8, duration: 2.4, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.4 });
        gsap.to(accent, { textShadow: "0 0 28px rgba(255,255,255,.55)", duration: 1.8, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.4 });
      }
    }, root);
    return () => ctx.revert();
  }, []);

  const word = (text, key, isEm) => {
    const Tag = isEm ? "em" : "span";
    return text.split(/(\s+)/).map((w, i) =>
      /^\s+$/.test(w) ? (
        " "
      ) : (
        <span className="word" key={`${key}-${i}`}>
          {isEm ? (
            <Tag>{[...w].map((c, j) => <span className="char-wrap" key={j}><span className="char">{c}</span></span>)}</Tag>
          ) : (
            [...w].map((c, j) => <span className="char-wrap" key={j}><span className="char">{c}</span></span>)
          )}
        </span>
      )
    );
  };

  return (
    <section className="club_hero" ref={root}>
      <ClubSky />
      <div className="club_hero-inner">
        <p className="club_eyebrow">Ascension — le club</p>
        <h1 className="club_title" aria-label={parts.join("")}>
          {parts.map((p, i) => word(p, i, i % 2 === 1))}
        </h1>
        <p className="club_hero-sub t-20">{subtitle}</p>
      </div>
      <div className="club_cue" aria-hidden="true">
        <span>Monter</span>
        <i />
      </div>
    </section>
  );
}
