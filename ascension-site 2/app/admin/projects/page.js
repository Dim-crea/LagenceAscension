"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { Field, TextInput, Textarea, Toggle, TagsInput, ImageUploader, GalleryUploader } from "@/components/admin/ui";

const EMPTY = {
  id: "",
  title: "",
  category: "",
  subcategory: "",
  tags: [],
  description: "",
  client: "",
  year: String(new Date().getFullYear()),
  duration: "",
  deliverables: [],
  youtubeId: "",
  coverImage: "",
  gallery: [],
  featured: false,
  wedding: false,
  published: true,
  order: 0,
};

export default function ProjectsAdmin() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const res = await fetch("/api/admin/projects");
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
    const res = await fetch("/api/admin/projects", {
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
    if (!confirm("Supprimer ce projet ?")) return;
    await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <AdminShell
      title="Portfolio"
      description="Ajoutez, modifiez ou retirez les projets affichés sur le site et la page mariage."
    >
      <form onSubmit={save} className="mb-12 rounded-card border border-line bg-kelp/30 p-6 sm:p-8">
        <h2 className="mb-6 font-display text-lg font-semibold text-white">
          {form.id ? `Modifier — ${form.title}` : "Nouveau projet"}
        </h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Titre *">
            <TextInput
              required
              value={form.title}
              onChange={(e) => set({ title: e.target.value })}
              placeholder="Nom du projet / client"
            />
          </Field>
          <Field label="Client">
            <TextInput value={form.client} onChange={(e) => set({ client: e.target.value })} />
          </Field>
          <Field label="Catégorie (badge)" hint="Ex: Automobile, Hôtellerie, Mariage...">
            <TextInput value={form.category} onChange={(e) => set({ category: e.target.value })} />
          </Field>
          <Field label="Sous-catégorie" hint="Ex: Vidéo de marque, Aftermovie...">
            <TextInput value={form.subcategory} onChange={(e) => set({ subcategory: e.target.value })} />
          </Field>
          <Field label="Année">
            <TextInput value={form.year} onChange={(e) => set({ year: e.target.value })} />
          </Field>
          <Field label="Durée du tournage">
            <TextInput value={form.duration} onChange={(e) => set({ duration: e.target.value })} />
          </Field>
        </div>

        <div className="mt-5">
          <Field label="Description">
            <Textarea value={form.description} onChange={(e) => set({ description: e.target.value })} />
          </Field>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Tags">
            <TagsInput value={form.tags} onChange={(tags) => set({ tags })} />
          </Field>
          <Field label="Livrables">
            <TagsInput value={form.deliverables} onChange={(deliverables) => set({ deliverables })} />
          </Field>
        </div>

        <div className="mt-5">
          <Field label="ID vidéo YouTube" hint="Uniquement l'identifiant, ex: wFxb59pftS8 (laisser vide si aucune vidéo)">
            <TextInput value={form.youtubeId} onChange={(e) => set({ youtubeId: e.target.value })} />
          </Field>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <ImageUploader label="Image de couverture" value={form.coverImage} onChange={(coverImage) => set({ coverImage })} />
          <GalleryUploader value={form.gallery} onChange={(gallery) => set({ gallery })} />
        </div>

        <div className="mt-6 flex flex-wrap gap-6 border-t border-line pt-5">
          <Toggle checked={form.published} onChange={(published) => set({ published })} label="Publié sur le site" />
          <Toggle checked={form.featured} onChange={(featured) => set({ featured })} label="Grande carte (mise en avant)" />
          <Toggle checked={form.wedding} onChange={(wedding) => set({ wedding })} label="Afficher sur la page Mariage" />
        </div>

        <div className="mt-7 flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-sm bg-white px-6 py-2.5 text-sm font-semibold text-black disabled:opacity-60"
          >
            {saving ? "Enregistrement..." : form.id ? "Enregistrer les modifications" : "Créer le projet"}
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
        Projets existants {!loading && `(${items.length})`}
      </h2>

      {loading ? (
        <p className="text-sm text-silver">Chargement...</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-silver">Aucun projet pour le moment.</p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {items.map((p) => (
            <div
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-line bg-kelp/20 px-5 py-3.5"
            >
              <div>
                <p className="text-sm font-medium text-white">
                  {p.title}{" "}
                  {!p.published && (
                    <span className="ml-1.5 rounded-full border border-line2 px-2 py-0.5 text-[10px] text-slate">
                      brouillon
                    </span>
                  )}
                  {p.wedding && (
                    <span className="ml-1.5 rounded-full border border-line2 px-2 py-0.5 text-[10px] text-slate">
                      mariage
                    </span>
                  )}
                </p>
                <p className="text-xs text-slate">
                  {[p.category, p.subcategory, p.client].filter(Boolean).join(" · ")}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => edit(p)}
                  className="rounded-sm border border-line2 px-3.5 py-1.5 text-xs text-silver hover:text-white"
                >
                  Modifier
                </button>
                <button
                  onClick={() => remove(p.id)}
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
