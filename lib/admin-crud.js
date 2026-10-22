import { NextResponse } from "next/server";
import { bySortOrder } from "@/lib/content";

// Shared GET (list) + POST (upsert) + DELETE (by id) handlers for the
// admin content collections (projects, services, testimonials, faq).
export function createCrudRoutes({ getAll, upsert, remove }) {
  async function GET() {
    const list = await getAll();
    return NextResponse.json(bySortOrder(list));
  }

  async function POST(request) {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });
    }
    const saved = await upsert(body);
    return NextResponse.json(saved);
  }

  return { GET, POST };
}

export function createCrudItemRoute({ remove }) {
  async function DELETE(request, context) {
    const { id } = await context.params;
    await remove(id);
    return NextResponse.json({ ok: true });
  }
  return { DELETE };
}
