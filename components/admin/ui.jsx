"use client";

import { useRef, useState } from "react";
import Image from "next/image";

export function Field({ label, hint, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] uppercase tracking-[0.12em] text-silver">{label}</span>
      {children}
      {hint && <span className="text-[11px] text-slate">{hint}</span>}
    </label>
  );
}

const inputClass =
  "w-full rounded-sm border border-line bg-abyss px-3.5 py-2.5 text-sm text-mist outline-none focus:border-line2";

export function TextInput(props) {
  return <input {...props} className={inputClass} />;
}

export function Textarea(props) {
  return <textarea {...props} rows={props.rows || 4} className={`${inputClass} resize-y`} />;
}

export function Select({ options, ...props }) {
  return (
    <select {...props} className={inputClass}>
      {options.map((o) => (
        <option key={o.value ?? o} value={o.value ?? o}>
          {o.label ?? o}
        </option>
      ))}
    </select>
  );
}

export function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2.5 text-left"
    >
      <span
        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
          checked ? "bg-emerald-400" : "bg-line2"
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
            checked ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </span>
      <span className="text-sm text-mist">{label}</span>
    </button>
  );
}

// Comma-separated tag list editor (e.g. tags, deliverables).
export function TagsInput({ value = [], onChange, placeholder }) {
  const [draft, setDraft] = useState("");

  const commit = () => {
    const v = draft.trim();
    if (v) onChange([...value, v]);
    setDraft("");
  };

  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-1.5">
        {value.map((v, i) => (
          <span
            key={`${v}-${i}`}
            className="flex items-center gap-1.5 rounded-full border border-line2 px-2.5 py-1 text-xs text-silver"
          >
            {v}
            <button
              type="button"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              className="text-slate hover:text-white"
            >
              ✕
            </button>
          </span>
        ))}
      </div>
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            commit();
          }
        }}
        onBlur={commit}
        placeholder={placeholder || "Tapez puis Entrée"}
        className={inputClass}
      />
    </div>
  );
}

// Single image uploader, uses /api/admin/media, shows a preview.
export function ImageUploader({ value, onChange, label = "Image" }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const upload = async (file) => {
    setUploading(true);
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/media", { method: "POST", body: fd });
    setUploading(false);
    if (res.ok) {
      const data = await res.json();
      onChange(data.url);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Échec de l'upload.");
    }
  };

  return (
    <div>
      <span className="mb-1.5 block text-[11px] uppercase tracking-[0.12em] text-silver">{label}</span>
      <div className="flex items-center gap-3">
        {value ? (
          <div className="relative h-20 w-28 overflow-hidden rounded-sm border border-line bg-kelp">
            <Image src={value} alt="" fill className="object-cover" />
          </div>
        ) : (
          <div className="flex h-20 w-28 items-center justify-center rounded-sm border border-dashed border-line2 text-[10px] text-slate">
            Aucune image
          </div>
        )}
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="rounded-sm border border-line2 px-3 py-2 text-xs text-silver hover:border-white hover:text-white disabled:opacity-60"
          >
            {uploading ? "Envoi..." : value ? "Remplacer" : "Choisir un fichier"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-left text-xs text-slate hover:text-red-300"
            >
              Retirer
            </button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-red-300">{error}</p>}
    </div>
  );
}

// Multi-image gallery uploader.
export function GalleryUploader({ value = [], onChange }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const upload = async (files) => {
    setUploading(true);
    const urls = [];
    for (const file of files) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/media", { method: "POST", body: fd });
      if (res.ok) {
        const data = await res.json();
        urls.push(data.url);
      }
    }
    setUploading(false);
    onChange([...value, ...urls]);
  };

  return (
    <div>
      <span className="mb-1.5 block text-[11px] uppercase tracking-[0.12em] text-silver">
        Galerie photos
      </span>
      <div className="mb-2 flex flex-wrap gap-2">
        {value.map((src, i) => (
          <div key={src} className="relative h-16 w-20 overflow-hidden rounded-sm border border-line">
            <Image src={src} alt="" fill className="object-cover" />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-black/70 text-[9px] text-white"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="rounded-sm border border-line2 px-3 py-2 text-xs text-silver hover:border-white hover:text-white disabled:opacity-60"
      >
        {uploading ? "Envoi..." : "Ajouter des photos"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => e.target.files?.length && upload(Array.from(e.target.files))}
      />
    </div>
  );
}
