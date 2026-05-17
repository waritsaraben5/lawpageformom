import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { dateInputToPublishedAt } from "@/lib/articles-publish";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const startDate =
      typeof body.start_date === "string" ? body.start_date.trim() : "";
    const articleIds = Array.isArray(body.article_ids)
      ? (body.article_ids as string[])
      : null;

    const startIso = dateInputToPublishedAt(startDate);
    if (!startIso) {
      return NextResponse.json({ error: "Invalid start date" }, { status: 400 });
    }

    let query = supabase
      .from("articles")
      .select("id, created_at, published_at")
      .is("published_at", null)
      .order("created_at", { ascending: true });

    if (articleIds?.length) {
      query = query.in("id", articleIds);
    }

    const { data: drafts, error: fetchError } = await query;

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!drafts?.length) {
      return NextResponse.json(
        { error: "ไม่มีฉบับร่างให้จัดตาราง" },
        { status: 400 }
      );
    }

    const startMs = new Date(startIso).getTime();
    const weekMs = 7 * 24 * 60 * 60 * 1000;
    const updates = drafts.map((draft, index) => ({
      id: draft.id,
      published_at: new Date(startMs + index * weekMs).toISOString(),
    }));

    for (const row of updates) {
      const { error } = await supabase
        .from("articles")
        .update({ published_at: row.published_at })
        .eq("id", row.id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ scheduled: updates.length, updates });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
