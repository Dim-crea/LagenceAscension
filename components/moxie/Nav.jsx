"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const LINKS = [
  { href: "/#Section-Services", label: "Services" },
  { href: "/j-ai-un-projet", label: "J'ai un projet" },
  { href: "/mariage", label: "Mariage" },
  // { href: "/agence", label: "L'Agence" }, // page masquée — décommenter pour la réafficher
  { href: "/club", label: "Club Ascension" },
];

export default function Nav() {
  const nav = useRef(null);
  const menu = useRef(null);
  const [open, setOpen] = useState(false);

  // Hide on scroll down, show on scroll up (as moxiegrouppr.com).
  useEffect(() => {
    const el = nav.current;
    let hidden = false;
    const hide = () => {
      hidden = true;
      gsap.to(el, { autoAlpha: 0, duration: 0.3, overwrite: true });
    };
    const show = () => {
      hidden = false;
      gsap.to(el, { autoAlpha: 1, duration: 0.3, overwrite: true });
    };
    const st = ScrollTrigger.create({
      start: 50,
      end: "max",
      onUpdate: (self) => {
        if (document.documentElement.classList.contains("menu-open")) return;
        if (self.scroll() < 50) return hidden && show();
        if (self.direction === 1 && !hidden) hide();
        if (self.direction === -1 && hidden) show();
      },
    });
    return () => st.kill();
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    const m = menu.current;
    const links = m.querySelectorAll(".nav_menu_link");
    html.classList.toggle("menu-open", open);
    gsap.killTweensOf([m, links]);
    if (open) {
      gsap.set(m, { visibility: "visible" });
      gsap.to(m, { opacity: 1, duration: 0.45, ease: "power2.out" });
      gsap.fromTo(links, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.08, delay: 0.1 });
    } else {
      gsap.to(m, { opacity: 0, duration: 0.3, ease: "power2.in", onComplete: () => gsap.set(m, { visibility: "hidden" }) });
    }
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => () => document.documentElement.classList.remove("menu-open"), []);

  return (
    <div className="nav_component" ref={nav}>
      <div className="padding-global">
        <div className="nav_container">
          <button className="nav_button" aria-label={open ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
            <span className="nav_button-inner">
              <span className="nav_button-line is-top" />
              <span className="nav_button-line is-center" />
              <span className="nav_button-line is-bottom" />
            </span>
          </button>
          <Link href="/" className="nav_brand" aria-label="Ascension — Accueil" onClick={() => setOpen(false)}>
            <span className="nav_logo">
              <Image src="/images/brand/logo-white.png" alt="Ascension" width={500} height={167} priority />
            </span>
          </Link>
          <div className="nav_cta">
            <Link href="/j-ai-un-projet" className="button is-primary">
              J'ai un projet
            </Link>
          </div>
        </div>
      </div>

      <nav className="nav_menu" ref={menu} aria-label="Menu principal">
        <div className="nav_menu-inner">
          <div className="nav_link-list">
            {LINKS.map((l) => (
              <Link key={l.label} href={l.href} className="nav_menu_link" onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
