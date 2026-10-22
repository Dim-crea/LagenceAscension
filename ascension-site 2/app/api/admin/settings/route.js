import { NextResponse } from "next/server";
import { getSettings, setSettings } from "@/lib/content";

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json(settings);
}

export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });
  }
  const saved = await setSettings(body);
  return NextResponse.json(saved);
}
