"use client";

import { useEffect, useRef } from "react";

// Rising particles: the sky of the club. They drift upward, speed up with scroll, and part around the pointer.
export default function ClubSky() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf;
    let visible = true;
    let lastY = window.scrollY;
    let boost = 0;
    const mouse = { x: -999, y: -999 };

    const make = () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      z: 0.3 + Math.random() * 0.9,
      tw: Math.random() * Math.PI * 2,
    });
    let dots = [];
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(Math.floor((w * h) / 5500), 260);
      dots = Array.from({ length: n }, make);
    };
    resize();

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("resize", resize);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);

    const frame = (t) => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const sy = window.scrollY;
      boost = boost * 0.92 + Math.min(Math.abs(sy - lastY), 60) * 0.08;
      lastY = sy;
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        const speed = (0.18 + d.z * 0.5) * (1 + boost * 0.5);
        if (!reduced) d.y -= speed;
        const dx = d.x - mouse.x;
        const dy = d.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 130) {
          const f = (1 - dist / 130) * 1.6 * d.z;
          d.x += (dx / (dist || 1)) * f;
          d.y += (dy / (dist || 1)) * f;
        }
        if (d.y < -10) {
          d.y = h + 10;
          d.x = Math.random() * w;
        }
        const a = 0.25 + 0.45 * Math.abs(Math.sin(t / 900 + d.tw));
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.z * 1.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${a * d.z})`;
        ctx.fill();
        if (d.z > 1 && boost > 4) {
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x, d.y + boost * 2.2);
          ctx.strokeStyle = `rgba(255,255,255,${0.12 * d.z})`;
          ctx.stroke();
        }
      }
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="club_sky" aria-hidden="true" />;
}
