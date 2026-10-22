"use client";

import { useEffect, useRef } from "react";

// Fixed altimeter on the right edge: the whole page is a climb from 0 to 8 848 m.
export default function AltitudeGauge() {
  const ruler = useRef(null);
  const label = useRef(null);
  const fill = useRef(null);

  useEffect(() => {
    let raf;
    const tick = () => {
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const p = Math.min(Math.max(window.scrollY / max, 0), 1);
      if (label.current) label.current.textContent = `${Math.round(p * 8848).toLocaleString("fr-FR")} m`;
      if (ruler.current) ruler.current.style.backgroundPositionY = `${window.scrollY * 0.35}px`;
      if (fill.current) fill.current.style.transform = `scaleY(${p})`;
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <aside className="club_gauge" aria-hidden="true">
      <span className="club_gauge-title">Altitude</span>
      <div className="club_gauge-body">
        <div className="club_gauge-ruler" ref={ruler} />
        <div className="club_gauge-track"><i ref={fill} /></div>
      </div>
      <span className="club_gauge-value" ref={label}>0 m</span>
    </aside>
  );
}
