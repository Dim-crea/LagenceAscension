"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { Field, TextInput, Textarea, Toggle } from "@/components/admin/ui";

const EMPTY = { id: "", question: "", answer: "", wedding: false, published: true, order: 0 };

export default function FaqAdmin() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const res = await fetch("/api/admin/faq");
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
    const res = await fetch("/api/admin/faq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      reset();
      load();
    }
  };

  const remove = async (id) => {
    if (!confirm("Supprimer cette question ?")) return;
    await fetch(`/api/admin/faq/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <AdminShell title="FAQ" description="Questions fréquentes affichées sur l'accueil et la page mariage.">
      <form onSubmit={save} className="mb-12 rounded-card border border-line bg-kelp/30 p-6 sm:p-8">
        <h2 className="mb-6 font-display text-lg font-semibold text-white">
          {form.id ? "Modifier la question" : "Nouvelle question"}
        </h2>

        <Field label="Question *">
          <TextInput required value={form.question} onChange={(e) => set({ question: e.target.value })} />
        </Field>

        <div className="mt-5">
          <Field label="Réponse *">
            <Textarea required value={form.answer} onChange={(e) => set({ answer: e.target.value })} />
          </Field>
        </div>

        <div className="mt-6 flex flex-wrap gap-6 border-t border-line pt-5">
          <Toggle checked={form.published} onChange={(published) => set({ published })} label="Publié" />
          <Toggle checked={form.wedding} onChange={(wedding) => set({ wedding })} label="Afficher sur la page Mariage (au lieu de l'accueil)" />
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
        Questions existantes {!loading && `(${items.length})`}
      </h2>

      {loading ? (
        <p className="text-sm text-silver">Chargement...</p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {items.map((f) => (
            <div
              key={f.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-line bg-kelp/20 px-5 py-3.5"
            >
              <div>
                <p className="text-sm font-medium text-white">
                  {f.question}{" "}
                  {!f.published && (
                    <span className="ml-1.5 rounded-full border border-line2 px-2 py-0.5 text-[10px] text-slate">
                      brouillon
                    </span>
                  )}
                  {f.wedding && (
                    <span className="ml-1.5 rounded-full border border-line2 px-2 py-0.5 text-[10px] text-slate">
                      mariage
                    </span>
                  )}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => edit(f)}
                  className="rounded-sm border border-line2 px-3.5 py-1.5 text-xs text-silver hover:text-white"
                >
                  Modifier
                </button>
                <button
                  onClick={() => remove(f.id)}
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
