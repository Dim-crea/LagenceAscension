"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { Field, TextInput, Textarea, Toggle, Select } from "@/components/admin/ui";

const EMPTY = {
  id: "",
  name: "",
  role: "",
  quote: "",
  rating: 5,
  wedding: false,
  published: true,
  order: 0,
};

export default function TestimonialsAdmin() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const res = await fetch("/api/admin/testimonials");
    setItems(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));
  const edit = (item) => {
    setForm(item);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const reset = () => setForm(EMPTY);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, rating: Number(form.rating) }),
    });
    setSaving(false);
    if (res.ok) {
      reset();
      load();
    }
  };

  const remove = async (id) => {
    if (!confirm("Supprimer cet avis ?")) return;
    await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <AdminShell title="Avis clients" description="Ajoutez les retours de vos clients et de vos mariés.">
      <form onSubmit={save} className="mb-12 rounded-card border border-line bg-kelp/30 p-6 sm:p-8">
        <h2 className="mb-6 font-display text-lg font-semibold text-white">
          {form.id ? `Modifier — ${form.name}` : "Nouvel avis"}
        </h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Nom *">
            <TextInput required value={form.name} onChange={(e) => set({ name: e.target.value })} />
          </Field>
          <Field label="Rôle / Entreprise">
            <TextInput value={form.role} onChange={(e) => set({ role: e.target.value })} placeholder="Ex: L'Agent Auto, Montpellier" />
          </Field>
        </div>

        <div className="mt-5">
          <Field label="Avis *">
            <Textarea required value={form.quote} onChange={(e) => set({ quote: e.target.value })} />
          </Field>
        </div>

        <div className="mt-5 max-w-[160px]">
          <Field label="Note">
            <Select
              value={form.rating}
              onChange={(e) => set({ rating: e.target.value })}
              options={[5, 4, 3, 2, 1].map((n) => ({ value: n, label: `${n} étoiles` }))}
            />
          </Field>
        </div>

        <div className="mt-6 flex flex-wrap gap-6 border-t border-line pt-5">
          <Toggle checked={form.published} onChange={(published) => set({ published })} label="Publié" />
          <Toggle checked={form.wedding} onChange={(wedding) => set({ wedding })} label="Afficher sur la page Mariage" />
        </div>

        <div className="mt-7 flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-sm bg-white px-6 py-2.5 text-sm font-semibold text-black disabled:opacity-60"
          >
            {saving ? "Enregistrement..." : form.id ? "Enregistrer" : "Créer"}
          </button>
          {form.id && (
            <button
              type="button"
              onClick={reset}
              className="rounded-sm border border-line2 px-6 py-2.5 text-sm text-silver hover:text-white"
            >
              Annuler
            </button>
          )}
        </div>
      </form>

      <h2 className="mb-4 font-display text-lg font-semibold text-white">
        Avis existants {!loading && `(${items.length})`}
      </h2>

      {loading ? (
        <p className="text-sm text-silver">Chargement...</p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {items.map((t) => (
            <div
              key={t.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-line bg-kelp/20 px-5 py-3.5"
            >
              <div>
                <p className="text-sm font-medium text-white">
                  {t.name}{" "}
                  {!t.published && (
                    <span className="ml-1.5 rounded-full border border-line2 px-2 py-0.5 text-[10px] text-slate">
                      brouillon
                    </span>
                  )}
                  {t.wedding && (
                    <span className="ml-1.5 rounded-full border border-line2 px-2 py-0.5 text-[10px] text-slate">
                      mariage
                    </span>
                  )}
                </p>
                <p className="max-w-lg truncate text-xs text-slate">{t.quote}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => edit(t)}
                  className="rounded-sm border border-line2 px-3.5 py-1.5 text-xs text-silver hover:text-white"
                >
                  Modifier
                </button>
                <button
                  onClick={() => remove(t.id)}
                  className="rounded-sm border border-line2 px-3.5 py-1.5 text-xs text-silver hover:border-red-300 hover:text-red-300"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
