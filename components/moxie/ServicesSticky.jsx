"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Sticky "arcs" section: as you scroll, arcs widen across the columns and each column's text fades in.
export default function ServicesSticky({ title, services, id = "Section-Services" }) {
  const root = useRef(null);
  const list = services.filter((s) => s.published !== false);
  const N = list.length;

  useEffect(() => {
    if (N < 2) return;
    const wrapper = root.current.querySelector(".services_relative");
    const cards = gsap.utils.toArray(wrapper.querySelectorAll(".services_card"));
    const borders = gsap.utils.toArray(wrapper.querySelectorAll(".services_card-border"));
    const mm = gsap.matchMedia();

    // Width (desktop) / height (mobile) of arc k once step s is reached.
    const base = (k, desk) => (desk ? 100 / N - 1.5 + k : 25 + 3 * k);
    const target = (k, s, desk) => (s === 0 ? base(k, desk) : ((s + 1) / N) * 100 - (desk ? 1.5 : 0) + (desk ? 1 : 3) * (k - s));

    const wire = (card, i, desk, trigger) => {
      const txt = card.querySelector(".services_card-txt");
      gsap.set(txt, desk ? { opacity: 0, xPercent: -10 } : { opacity: 0, yPercent: -50 });
      const prop = desk ? "width" : "height";
      const ks = borders.map((_, k) => k).filter((k) => k >= i);
      ScrollTrigger.create({
        ...trigger,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
          tl.to(txt, desk ? { opacity: 1, xPercent: 0, duration: 0.6 } : { opacity: 1, yPercent: 0, duration: 0.5 });
          ks.forEach((k) => tl.to(borders[k], { [prop]: `${target(k, i, desk)}%`, duration: desk ? 0.6 : 0.5 }, 0));
        },
        onLeaveBack: () => {
          const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });
          tl.to(txt, desk ? { opacity: 0, xPercent: -10, duration: 0.4 } : { opacity: 0, yPercent: -50, duration: 0.4 });
          ks.forEach((k) => tl.to(borders[k], { [prop]: `${target(k, i - 1, desk)}%`, duration: 0.4 }, 0));
        },
      });
    };

    mm.add("(min-width: 768px)", () => {
      const pre = 75;
      const post = 75;
      const steps = N - 1;
      const usable = N * window.innerHeight;
      gsap.set(wrapper, { height: usable + pre + post });
      cards.forEach((card, i) => {
        if (i === 0) return;
        const s = i - 1;
        wire(card, i, true, {
          trigger: wrapper,
          start: () => `top+=${pre + (s * usable) / steps}px top`,
          end: () => `top+=${pre + ((s + 1) * usable) / steps}px top`,
        });
      });
      return () => {
        gsap.set(wrapper, { clearProps: "height" });
        gsap.set([...borders, ...cards.map((c) => c.querySelector(".services_card-txt"))], { clearProps: "all" });
      };
    });

    mm.add("(max-width: 767px)", () => {
      cards.forEach((card, i) => {
        if (i === 0) return;
        wire(card, i, false, { trigger: card, start: "top 50%" });
      });
      return () => gsap.set([...borders, ...cards.map((c) => c.querySelector(".services_card-txt"))], { clearProps: "all" });
    });

    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => {
      window.removeEventListener("load", refresh);
      mm.revert();
    };
  }, [N]);

  if (!N) return null;

  return (
    <section className="section_services" id={id} ref={root}>
      <div className="padding-global">
        <div className="services_container">
          <div className="services_relative">
            <div className="services_sticky" style={{ "--n": N, "--col": `${100 / N}%` }}>
              <div className="services_header">
                <h2 className="hd-30">{title}</h2>
              </div>
              <div className="services_list-card">
                {list.map((s) => (
                  <div className="services_card" key={s.id}>
                    <div className="services_card-txt">
                      <h2 className="hd-26">{s.title}</h2>
                      <p>
                        {(s.tags || []).map((t, i) => (
                          <span key={t}>
                            {t}
                            {i < s.tags.length - 1 && <br />}
                          </span>
                        ))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="services_list-border">
                {list.map((s, k) => (
                  <div className="services_card-border" key={s.id} style={{ "--idx": k + 1 }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
