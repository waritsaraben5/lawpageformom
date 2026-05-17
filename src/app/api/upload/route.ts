import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function safeExt(file: File): string {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safe = ["jpeg", "jpg", "png", "webp", "gif"].includes(ext) ? ext : "jpg";
  return safe === "jpeg" ? "jpg" : safe;
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const uploadType = formData.get("upload_type");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "รองรับเฉพาะไฟล์ JPG, PNG, WebP หรือ GIF" },
        { status: 400 }
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "ไฟล์ใหญ่เกิน 5 MB" },
        { status: 400 }
      );
    }

    const ext = safeExt(file);
    let path: string;

    if (uploadType === "article") {
      path = `articles/cover-${Date.now()}.${ext}`;
    } else {
      const pageKey = formData.get("page_key");
      const sectionKey = formData.get("section_key");

      if (typeof pageKey !== "string" || typeof sectionKey !== "string") {
        return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
      }

      if (!/^[a-z0-9_-]+$/.test(pageKey) || !/^[a-z0-9_-]+$/.test(sectionKey)) {
        return NextResponse.json({ error: "Invalid keys" }, { status: 400 });
      }

      path = `${pageKey}/${sectionKey}-${Date.now()}.${ext}`;
    }

    const { error: uploadError } = await supabase.storage
      .from("site-images")
      .upload(path, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("site-images").getPublicUrl(path);

    if (uploadType !== "article") {
      const pageKey = formData.get("page_key") as string;
      const sectionKey = formData.get("section_key") as string;

      const { error: contentError } = await supabase.from("content_blocks").upsert(
        [
          {
            page_key: pageKey,
            section_key: sectionKey,
            content_text: publicUrl,
            updated_at: new Date().toISOString(),
          },
        ],
        { onConflict: "page_key,section_key" }
      );

      if (contentError) {
        return NextResponse.json({ error: contentError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ url: publicUrl });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
