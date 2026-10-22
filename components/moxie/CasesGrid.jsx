"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { wordmarkClass } from "@/lib/rich";

const PLUS = (
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
    <path d="M6 1v10M1 6h10" />
  </svg>
);
const CLOSE = (
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
    <path d="M1 1l10 10M11 1 1 11" />
  </svg>
);
const arrow = (d) => (
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
    <path d={d === "prev" ? "M8 1 3 6l5 5" : "M4 1l5 5-5 5"} />
  </svg>
);

// Photos of a project: its gallery (the cover is already the hero image of the window when there is no film).
const photosOf = (p) => (p.gallery || []).filter(Boolean);

function Card({ project, onOpen }) {
  return (
    <div
      className="cases_card"
      onClick={() => onOpen(project)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onOpen(project))}
      aria-label={`Voir le projet ${project.title}`}
    >
      <div className="cases_card-logo-icon">
        <span className={`cases_card-logo ${wordmarkClass(project.title)}`}>{project.title}</span>
        <span className="cases_card-icon">{PLUS}</span>
      </div>
      <span className="cases_card-more t-14">Voir le projet</span>
      <div className="cases_card-overlay" />
      <div className="bg">
        {project.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.coverImage} alt={project.title} loading="lazy" />
        )}
      </div>
    </div>
  );
}

function ProjectWindow({ project, onClose, onPhoto }) {
  const photos = photosOf(project);
  const meta = [project.category, project.client, project.year, project.duration].filter(Boolean);
  const deliverables = (project.deliverables || []).filter(Boolean);

  return (
    <div className="pw" role="dialog" aria-modal="true" aria-label={project.title} onClick={onClose}>
      <div className="pw_panel" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="pw_close" onClick={onClose} aria-label="Fermer">
          {CLOSE}
        </button>

        <div className="pw_media">
          {project.youtubeId ? (
            <iframe
              src={`https://www.youtube.com/embed/${project.youtubeId}?rel=0&modestbranding=1`}
              title={project.title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            project.coverImage && <img src={project.coverImage} alt={project.title} />
          )}
        </div>

        <div className="pw_body">
          <div className="pw_head">
            <h2 className="hd-50">{project.title}</h2>
            {meta.length > 0 && (
              <ul className="pw_meta">
                {meta.map((m) => (
                  <li className="pill" key={m}>
                    {m}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="pw_text">
            {project.description && <p className="t-18">{project.description}</p>}
            {deliverables.length > 0 && (
              <div>
                <p className="pw_label">Livrables</p>
                <ul className="pw_deliverables">
                  {deliverables.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {photos.length > 0 && (
            <div>
              <p className="pw_label">Photos</p>
              <div className="pw_photos">
                {photos.map((src, i) => (
                  <button type="button" key={src} className="pw_photo" onClick={() => onPhoto(photos, i, project.title)} aria-label={`Agrandir la photo ${i + 1}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={`${project.title} — photo ${i + 1}`} loading="lazy" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <Link href="/j-ai-un-projet" className="button is-primary pw_cta" onClick={onClose}>
            J'ai un projet similaire
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CasesGrid({ projects, emptyMessage }) {
  const [open, setOpen] = useState(null);
  const [photos, setPhotos] = useState(null); // { title, images, index }
  const list = projects.filter((p) => p.published !== false);

  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open && !photos) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        // close the photo viewer first, then the project window
        if (photos) setPhotos(null);
        else setOpen(null);
      } else if (photos && e.key === "ArrowRight") step(1);
      else if (photos && e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, photos]);

  const step = (d) => setPhotos((s) => s && { ...s, index: (s.index + d + s.images.length) % s.images.length });
  const openPhoto = (images, index, title) => setPhotos({ images, index, title });

  return (
    <section className="section_cases">
      <div className="padding-global padding-section-xsmall">
        <div className="container-large">
          {list.length === 0 ? (
            <div className="cases_card is-empty" style={{ minHeight: "14rem" }}>
              <p className="serif" style={{ fontSize: "1.75rem", maxWidth: "36rem", lineHeight: 1.2 }}>
                {emptyMessage || "Nos prochaines réalisations arrivent bientôt ici."}
              </p>
            </div>
          ) : (
            <div className={`cases_cms-list${list.length <= 3 ? " is-few" : ""}`} style={{ "--few": list.length }}>
              {list.map((p) => (
                <div key={p.id}>
                  <Card project={p} onOpen={setOpen} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {open && <ProjectWindow project={open} onClose={() => setOpen(null)} onPhoto={openPhoto} />}

      {photos && (
        <div role="dialog" aria-modal="true" aria-label={photos.title} onClick={() => setPhotos(null)} className="lightbox">
          <button type="button" className="button lightbox_close" onClick={() => setPhotos(null)}>
            Fermer
          </button>
          {photos.images.length > 1 && (
            <button type="button" className="swiper-arrow lightbox_nav is-prev" aria-label="Photo précédente" onClick={(e) => (e.stopPropagation(), step(-1))}>
              {arrow("prev")}
            </button>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photos.images[photos.index]} alt={`${photos.title} — photo ${photos.index + 1}`} onClick={(e) => e.stopPropagation()} />
          {photos.images.length > 1 && (
            <button type="button" className="swiper-arrow lightbox_nav is-next" aria-label="Photo suivante" onClick={(e) => (e.stopPropagation(), step(1))}>
              {arrow("next")}
            </button>
          )}
          <span className="lightbox_count t-14">
            {photos.index + 1} / {photos.images.length}
          </span>
        </div>
      )}
    </section>
  );
}
