"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

// A soft ring that trails the pointer and swells over interactive elements.
export default function ClubCursor() {
  const ring = useRef(null);
  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const el = ring.current;
    const x = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" });
    const y = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" });
    const move = (e) => {
      x(e.clientX);
      y(e.clientY);
      el.style.opacity = 1;
      const hot = e.target.closest("a, button, input, textarea, [data-cursor]");
      el.classList.toggle("is-hot", !!hot);
    };
    const leave = () => (el.style.opacity = 0);
    window.addEventListener("pointermove", move);
    document.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("mouseleave", leave);
    };
  }, []);
  return <div className="club_cursor" ref={ring} aria-hidden="true" />;
}
