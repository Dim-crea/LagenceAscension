import { readJSON, writeJSON } from "./content-store";
import {
  seedProjects,
  seedServices,
  seedTestimonials,
  seedFaq,
  seedSettings,
} from "./seed-data";

const KEYS = {
  projects: "projects",
  services: "services",
  testimonials: "testimonials",
  faq: "faq",
  settings: "settings",
};

const SEEDS = {
  projects: seedProjects,
  services: seedServices,
  testimonials: seedTestimonials,
  faq: seedFaq,
  settings: seedSettings,
};

async function getCollection(name) {
  return readJSON(KEYS[name], SEEDS[name]);
}

async function setCollection(name, value) {
  await writeJSON(KEYS[name], value);
  return value;
}

export const getProjects = () => getCollection("projects");
export const getServices = () => getCollection("services");
export const getTestimonials = () => getCollection("testimonials");
export const getFaq = () => getCollection("faq");
export async function getSettings() {
  const stored = await getCollection("settings");
  // Merge over the seed so settings saved before a field existed still render.
  const merged = { ...seedSettings, ...stored };
  for (const key of ["home", "wedding", "project", "club", "agency"]) {
    merged[key] = { ...seedSettings[key], ...stored?.[key] };
  }
  return merged;
}

export const setProjects = (v) => setCollection("projects", v);
export const setServices = (v) => setCollection("services", v);
export const setTestimonials = (v) => setCollection("testimonials", v);
export const setFaq = (v) => setCollection("faq", v);
export const setSettings = (v) => setCollection("settings", v);

function slugify(str) {
  return String(str)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

export function makeId(title) {
  const base = slugify(title) || "item";
  return `${base}-${Date.now().toString(36)}`;
}

async function upsertItem(name, item) {
  const list = await getCollection(name);
  const id = item.id || makeId(item.title || item.name || item.question);
  const withId = { ...item, id };
  const idx = list.findIndex((x) => x.id === id);
  let next;
  if (idx === -1) {
    const maxOrder = list.reduce((m, x) => Math.max(m, x.order || 0), 0);
    next = [...list, { order: maxOrder + 1, ...withId }];
  } else {
    next = list.map((x, i) => (i === idx ? { ...x, ...withId } : x));
  }
  await setCollection(name, next);
  return withId;
}

async function removeItem(name, id) {
  const list = await getCollection(name);
  const next = list.filter((x) => x.id !== id);
  await setCollection(name, next);
  return next;
}

export const upsertProject = (item) => upsertItem("projects", item);
export const removeProject = (id) => removeItem("projects", id);

export const upsertService = (item) => upsertItem("services", item);
export const removeService = (id) => removeItem("services", id);

export const upsertTestimonial = (item) => upsertItem("testimonials", item);
export const removeTestimonial = (id) => removeItem("testimonials", id);

export const upsertFaqItem = (item) => upsertItem("faq", item);
export const removeFaqItem = (id) => removeItem("faq", id);

export function bySortOrder(list) {
  return [...list].sort((a, b) => (a.order || 0) - (b.order || 0));
}
