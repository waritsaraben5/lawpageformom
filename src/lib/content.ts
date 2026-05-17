import { getDefaultContent } from "@/lib/defaults/content";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { ContentBlock } from "@/types/database";

export async function getContentBlock(
  pageKey: string,
  sectionKey: string
): Promise<string> {
  const fallback = getDefaultContent(pageKey, sectionKey);

  if (!isSupabaseConfigured()) {
    return fallback;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("content_blocks")
      .select("content_text")
      .eq("page_key", pageKey)
      .eq("section_key", sectionKey)
      .maybeSingle();

    if (error || !data) {
      return fallback;
    }

    return data.content_text || fallback;
  } catch {
    return fallback;
  }
}

export async function getPageContent(
  pageKey: string
): Promise<Record<string, string>> {
  const defaults = Object.entries(
    (await import("@/lib/defaults/content")).DEFAULT_CONTENT[pageKey] ?? {}
  );

  const result: Record<string, string> = Object.fromEntries(defaults);

  if (!isSupabaseConfigured()) {
    return result;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("content_blocks")
      .select("section_key, content_text")
      .eq("page_key", pageKey);

    if (error || !data) {
      return result;
    }

    for (const block of data as Pick<ContentBlock, "section_key" | "content_text">[]) {
      result[block.section_key] = block.content_text;
    }
  } catch {
    // use defaults
  }

  return result;
}
