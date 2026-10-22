import { NextResponse } from "next/server";
import { writeBinary } from "@/lib/content-store";
import crypto from "crypto";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 15 * 1024 * 1024; // 15MB

export async function POST(request) {
  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Format d'image non supporté." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Fichier trop volumineux (15 Mo max)." }, { status: 400 });
  }

  const ext = file.type.split("/")[1];
  const key = `media/${crypto.randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeBinary(key, buffer, file.type);

  return NextResponse.json({ url: `/api/media/${key.replace("media/", "")}` });
}
