"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import gsap from "gsap";

const pad = (n, l = 2) => String(n).padStart(l, "0");

// Hero as a film set: a live timecode, a REC light and a clapperboard that claps on load and on click (new take each time).
export default function Slate({ title, subtitle, director, place }) {
  const root = useRef(null);
  const tc = useRef(null);
  const [take, setTake] = useState(1);

  useEffect(() => {
    const el = root.current;
    const start = performance.now();
    let raf;
    const tick = () => {
      const t = (performance.now() - start) / 1000;
      const f = Math.floor((t % 1) * 25);
      if (tc.current) tc.current.textContent = `${pad(Math.floor(t / 3600))}:${pad(Math.floor(t / 60) % 60)}:${pad(Math.floor(t) % 60)}:${pad(f)}`;
      raf = requestAnimationFrame(tick);
    };
    tick();

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      gsap.set(".ag_clap-arm", { rotate: reduced ? 0 : -24 });
      if (reduced) return;
      const tl = gsap.timeline({ delay: 0.5 });
      tl.fromTo(".ag_title .word", { yPercent: 110 }, { yPercent: 0, duration: 1, ease: "power4.out", stagger: 0.04 })
        .fromTo(".ag_sub", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.5")
        .fromTo(".ag_board", { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" }, 0.2)
        .to(".ag_clap-arm", { rotate: 0, duration: 0.18, ease: "power4.in" }, 1.1)
        .fromTo(".ag_flash", { opacity: 0.9 }, { opacity: 0, duration: 0.5, ease: "power2.out" }, 1.28);
    }, el);
    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, []);

  const clap = () => {
    setTake((n) => n + 1);
    gsap
      .timeline()
      .to(".ag_clap-arm", { rotate: -24, duration: 0.25, ease: "power2.out" })
      .to(".ag_clap-arm", { rotate: 0, duration: 0.14, ease: "power4.in" })
      .fromTo(".ag_flash", { opacity: 0.9 }, { opacity: 0, duration: 0.45, ease: "power2.out" }, "-=0.02");
  };

  // Split into words wrapped for the reveal; *x* stays italic.
  const words = String(title)
    .split("*")
    .flatMap((seg, i) => seg.split(/\s+/).filter(Boolean).map((w) => ({ w, em: i % 2 === 1 })));

  return (
    <section className="ag_hero" ref={root}>
      <div className="ag_flash" aria-hidden="true" />
      <div className="ag_rec" aria-hidden="true">
        <i /> REC <span ref={tc}>00:00:00:00</span>
      </div>
      <div className="padding-global">
        <div className="container-large ag_hero-grid">
          <div className="ag_hero-text">
            <p className="club_eyebrow">L'Agence</p>
            <h1 className="ag_title hd-60">
              {words.map((t, i) => (
                <Fragment key={i}>
                  <span className="ag_word">
                    <span className="word">{t.em ? <em>{t.w}</em> : t.w}</span>
                  </span>{" "}
                </Fragment>
              ))}
            </h1>
            <p className="ag_sub t-18">{subtitle}</p>
          </div>

          <button type="button" className="ag_board" onClick={clap} aria-label="Clap ! Nouvelle prise">
            <span className="ag_clap" aria-hidden="true">
              <span className="ag_clap-arm" />
              <span className="ag_clap-base" />
            </span>
            <span className="ag_table">
              <span><b>Prod.</b>Ascension</span>
              <span><b>Dir.</b>{director}</span>
              <span><b>Lieu</b>{place}</span>
              <span><b>Prise</b><em className="ag_take">{pad(take)}</em></span>
            </span>
            <span className="ag_hint">Cliquez pour claquer</span>
          </button>
        </div>
      </div>
      <div className="club_cue" aria-hidden="true" style={{ opacity: 1 }}>
        <span>Scène 01</span>
        <i />
      </div>
    </section>
  );
}
