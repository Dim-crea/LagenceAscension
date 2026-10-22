import { promises as fs } from "fs";
import path from "path";

// Persists site content (projects, services, testimonials, settings).
// In production on Netlify, this uses Netlify Blobs (durable, works across
// serverless invocations). When running locally with plain `next dev`
// (no Netlify context available), it transparently falls back to JSON
// files on disk under /.data so the admin panel still works with zero setup.

const LOCAL_DIR = path.join(process.cwd(), ".data");
const LOCAL_MEDIA_DIR = path.join(LOCAL_DIR, "media");

let blobsStorePromise = null;

async function getBlobsStore() {
  if (blobsStorePromise) return blobsStorePromise;
  blobsStorePromise = (async () => {
    try {
      const { getStore } = await import("@netlify/blobs");
      const store = getStore({ name: "ascension-content", consistency: "strong" });
      // Probe the store so we fail fast and fall back if there's no context.
      await store.get("__probe__");
      return store;
    } catch (err) {
      return null;
    }
  })();
  return blobsStorePromise;
}

async function ensureLocalDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

export async function readJSON(key, fallback) {
  const store = await getBlobsStore();
  if (store) {
    const value = await store.get(key, { type: "json" });
    return value ?? fallback;
  }
  try {
    const file = path.join(LOCAL_DIR, `${key}.json`);
    const raw = await fs.readFile(file, "utf-8");
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export async function writeJSON(key, value) {
  const store = await getBlobsStore();
  if (store) {
    await store.setJSON(key, value);
    return;
  }
  await ensureLocalDir(LOCAL_DIR);
  const file = path.join(LOCAL_DIR, `${key}.json`);
  await fs.writeFile(file, JSON.stringify(value, null, 2), "utf-8");
}

export async function writeBinary(key, buffer, contentType) {
  const store = await getBlobsStore();
  if (store) {
    await store.set(key, buffer, { metadata: { contentType } });
    return;
  }
  await ensureLocalDir(LOCAL_MEDIA_DIR);
  const file = path.join(LOCAL_MEDIA_DIR, key.replace(/[/\\]/g, "_"));
  await fs.writeFile(file, buffer);
  const metaFile = `${file}.meta.json`;
  await fs.writeFile(metaFile, JSON.stringify({ contentType }), "utf-8");
}

export async function readBinary(key) {
  const store = await getBlobsStore();
  if (store) {
    const blob = await store.get(key, { type: "arrayBuffer" });
    if (!blob) return null;
    const metadata = await store.getMetadata(key);
    return { data: Buffer.from(blob), contentType: metadata?.metadata?.contentType || "application/octet-stream" };
  }
  try {
    const file = path.join(LOCAL_MEDIA_DIR, key.replace(/[/\\]/g, "_"));
    const data = await fs.readFile(file);
    let contentType = "application/octet-stream";
    try {
      const meta = JSON.parse(await fs.readFile(`${file}.meta.json`, "utf-8"));
      contentType = meta.contentType || contentType;
    } catch {}
    return { data, contentType };
  } catch {
    return null;
  }
}

export async function deleteKey(key) {
  const store = await getBlobsStore();
  if (store) {
    await store.delete(key);
    return;
  }
  try {
    const file = path.join(LOCAL_MEDIA_DIR, key.replace(/[/\\]/g, "_"));
    await fs.unlink(file).catch(() => {});
    await fs.unlink(`${file}.meta.json`).catch(() => {});
  } catch {}
}
