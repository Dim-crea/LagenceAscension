"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

// Four giant rows. On a pointer device a photo follows the cursor and swaps with the hovered row.
export default function Expertise({ items, images }) {
  const root = useRef(null);
  const preview = useRef(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!matchMedia("(hover: hover)").matches) return;
    const el = root.current;
    const x = gsap.quickTo(preview.current, "x", { duration: 0.5, ease: "power3.out" });
    const y = gsap.quickTo(preview.current, "y", { duration: 0.5, ease: "power3.out" });
    const move = (e) => {
      x(e.clientX);
      y(e.clientY);
    };
    const enter = () => gsap.to(preview.current, { opacity: 1, scale: 1, duration: 0.4, ease: "power3.out" });
    const leave = () => gsap.to(preview.current, { opacity: 0, scale: 0.8, duration: 0.3 });
    const list = el.querySelector(".ag_rows");
    list.addEventListener("mousemove", move);
    list.addEventListener("mouseenter", enter);
    list.addEventListener("mouseleave", leave);
    gsap.set(preview.current, { opacity: 0, scale: 0.8, xPercent: -50, yPercent: -50 });
    return () => {
      list.removeEventListener("mousemove", move);
      list.removeEventListener("mouseenter", enter);
      list.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <section className="ag_expertise" ref={root}>
      <div className="padding-global padding-section-large">
        <div className="container-large">
          <p className="club_eyebrow">Ce qu'on fait</p>
          <ul className="ag_rows">
            {items.map((it, i) => (
              <li className="ag_row" key={it.title} onMouseEnter={() => setActive(i)}>
                <span className="ag_row-n t-14">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="ag_row-title hd-50">{it.title}</h2>
                <p className="ag_row-text t-18">{it.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="ag_preview" ref={preview} aria-hidden="true">
        {images.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={src + i} src={src} alt="" className={i === active % images.length ? "is-on" : ""} />
        ))}
      </div>
    </section>
  );
}
