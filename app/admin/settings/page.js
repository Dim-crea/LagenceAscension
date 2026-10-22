"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { Field, TextInput, Textarea } from "@/components/admin/ui";

export default function SettingsAdmin() {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then(setSettings);
  }, []);

  if (!settings) {
    return (
      <AdminShell title="Réglages">
        <p className="text-sm text-silver">Chargement...</p>
      </AdminShell>
    );
  }

  const set = (patch) => setSettings((s) => ({ ...s, ...patch }));
  const setHero = (key, patch) => setSettings((s) => ({ ...s, [key]: { ...s[key], ...patch } }));
  const setStat = (i, patch) =>
    setSettings((s) => ({
      ...s,
      stats: s.stats.map((st, idx) => (idx === i ? { ...st, ...patch } : st)),
    }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  return (
    <AdminShell title="Réglages" description="Coordonnées, réseaux et textes d'accroche du site.">
      <form onSubmit={save} className="flex flex-col gap-10">
        <section className="rounded-card border border-line bg-kelp/30 p-6 sm:p-8">
          <h2 className="mb-6 font-display text-lg font-semibold text-white">Coordonnées</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Email de contact" hint="Reçoit les messages du formulaire de contact">
              <TextInput
                type="email"
                value={settings.contactEmail || ""}
                onChange={(e) => set({ contactEmail: e.target.value })}
              />
            </Field>
            <Field label="Téléphone">
              <TextInput value={settings.phone || ""} onChange={(e) => set({ phone: e.target.value })} />
            </Field>
            <Field label="Localisation">
              <TextInput value={settings.address || ""} onChange={(e) => set({ address: e.target.value })} />
            </Field>
            <Field label="SIREN">
              <TextInput value={settings.siren || ""} onChange={(e) => set({ siren: e.target.value })} />
            </Field>
            <Field label="Instagram (URL complète)">
              <TextInput value={settings.instagram || ""} onChange={(e) => set({ instagram: e.target.value })} />
            </Field>
            <Field label="LinkedIn (URL complète)">
              <TextInput value={settings.linkedin || ""} onChange={(e) => set({ linkedin: e.target.value })} />
            </Field>
            <Field label="YouTube (URL complète)">
              <TextInput value={settings.youtube || ""} onChange={(e) => set({ youtube: e.target.value })} />
            </Field>
          </div>
        </section>

        <TextBlock title="Page d'accueil" hint="Entourez un passage d'*astérisques* pour l'afficher en italique accentué. Les listes sont séparées par des virgules."
          value={settings.home} onChange={(p) => setHero("home", p)}
          fields={[
            ["lead", "Phrase d'accroche (début)", 2],
            ["phrases", "Fins de phrase qui défilent (séparées par des virgules)", 3],
            ["languageLead", "« Notre langage, c'est »", 1],
            ["languageWords", "Mots qui défilent (séparés par des virgules)", 2],
            ["statement", "Phrase manifeste", 2],
            ["servicesTitle", "Titre section services", 1],
            ["testimonialsTitle", "Titre section avis", 1],
            ["contactTitle", "Titre du formulaire de contact", 1],
            ["contactText", "Texte du formulaire de contact", 2],
          ]} />
        <TextBlock title="Page Mariage" hint="*astérisques* = italique accentué."
          value={settings.wedding} onChange={(p) => setHero("wedding", p)}
          fields={[["title", "Titre", 2], ["text", "Texte", 4], ["statement", "Phrase de fin", 2]]} />
        <TextBlock title="Page « J'ai un projet »" hint="*astérisques* = italique accentué."
          value={settings.project} onChange={(p) => setHero("project", p)}
          fields={[["title", "Titre", 2]]} />
        <TextBlock title="Club Ascension" hint="Expliquez pourquoi le club existe. *astérisques* = italique accentué."
          value={settings.club} onChange={(p) => setHero("club", p)}
          fields={[
            ["title", "Titre", 1],
            ["subtitle", "Sous-titre", 2],
            ["why", "Pourquoi le club a été créé", 6],
            ["mission", "Mission", 4],
            ["audience", "Pour qui ? (séparés par des virgules)", 2],
            ["engagement", "Phrase d'engagement", 2],
          ]} />
        <PillarsEditor pillars={settings.club?.pillars || []} onChange={(pillars) => setHero("club", { pillars })} />

        <TextBlock title="Page L'Agence" hint="*astérisques* = italique accentué."
          value={settings.agency} onChange={(p) => setHero("agency", p)}
          fields={[
            ["title", "Titre", 2],
            ["subtitle", "Sous-titre", 3],
            ["manifesto", "Phrase manifeste (défile mot à mot)", 4],
            ["founder", "Texte « Derrière l'agence »", 3],
            ["ctaTitle", "Titre de fin de page", 1],
          ]} />
        <PillarsEditor title="L'Agence — ce qu'on fait" hint="Les 4 lignes survolables de la page L'Agence."
          label="Domaine" pillars={settings.agency?.expertise || []} onChange={(expertise) => setHero("agency", { expertise })} />
        <PillarsEditor title="L'Agence — notre méthode" hint="Les 4 étapes qui défilent horizontalement."
          label="Étape" pillars={settings.agency?.steps || []} onChange={(steps) => setHero("agency", { steps })} />

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded-sm bg-white px-6 py-2.5 text-sm font-semibold text-black disabled:opacity-60"
          >
            {saving ? "Enregistrement..." : "Enregistrer les réglages"}
          </button>
          {saved && <span className="text-sm text-emerald-300">Enregistré ✓</span>}
        </div>
      </form>
    </AdminShell>
  );
}

function TextBlock({ title, hint, value, onChange, fields }) {
  if (!value) return null;
  return (
    <section className="rounded-card border border-line bg-kelp/30 p-6 sm:p-8">
      <h2 className="mb-2 font-display text-lg font-semibold text-white">{title}</h2>
      {hint && <p className="mb-6 text-xs text-slate">{hint}</p>}
      <div className="flex flex-col gap-5">
        {fields.map(([key, label, rows]) => (
          <Field key={key} label={label}>
            {rows === 1 ? (
              <TextInput value={value[key] || ""} onChange={(e) => onChange({ [key]: e.target.value })} />
            ) : (
              <Textarea rows={rows} value={value[key] || ""} onChange={(e) => onChange({ [key]: e.target.value })} />
            )}
          </Field>
        ))}
      </div>
    </section>
  );
}

function PillarsEditor({ pillars, onChange, title = "Club — les 4 niveaux", hint = "Affichés sur la page Club (escalier).", label = "Niveau" }) {
  const set = (i, patch) => onChange(pillars.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  return (
    <section className="rounded-card border border-line bg-kelp/30 p-6 sm:p-8">
      <h2 className="mb-2 font-display text-lg font-semibold text-white">{title}</h2>
      <p className="mb-6 text-xs text-slate">{hint}</p>
      <div className="flex flex-col gap-5">
        {pillars.map((p, i) => (
          <div key={i} className="grid grid-cols-1 gap-3 sm:grid-cols-[220px_1fr]">
            <Field label={`${label} ${i + 1} — titre`}>
              <TextInput value={p.title} onChange={(e) => set(i, { title: e.target.value })} />
            </Field>
            <Field label="Description">
              <Textarea rows={2} value={p.text} onChange={(e) => set(i, { text: e.target.value })} />
            </Field>
          </div>
        ))}
      </div>
    </section>
  );
}
