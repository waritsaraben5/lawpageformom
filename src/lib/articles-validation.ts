import type { ArticleCategory } from "@/types/database";
import { dateInputToPublishedAt, type PublishMode } from "@/lib/articles-publish";

export type ArticleInput = {
  title: string;
  category: ArticleCategory;
  summary: string;
  body: string;
  image_url: string | null;
  published_at: string | null;
};

function parseImageUrl(value: unknown): string | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return trimmed;
  } catch {
    return null;
  }
}

function parsePublishedAt(
  publishMode: unknown,
  scheduleDate: unknown,
  publishedAt: unknown
): string | null | "invalid" {
  if (publishMode === "draft") return null;
  if (publishMode === "now") return new Date().toISOString();
  if (publishMode === "schedule") {
    if (typeof scheduleDate !== "string" || !scheduleDate.trim()) {
      return "invalid";
    }
    const iso = dateInputToPublishedAt(scheduleDate.trim());
    return iso ?? "invalid";
  }

  if (publishedAt === null || publishedAt === undefined || publishedAt === "") {
    return null;
  }
  if (typeof publishedAt !== "string") return "invalid";
  const d = new Date(publishedAt);
  if (Number.isNaN(d.getTime())) return "invalid";
  return publishedAt;
}

export function parseArticleInput(body: unknown): ArticleInput | null {
  if (!body || typeof body !== "object") return null;

  const record = body as Record<string, unknown>;
  const { title, category, summary, body: articleBody, image_url } = record;
  const publishMode = record.publish_mode as PublishMode | undefined;
  const scheduleDate = record.schedule_date;
  const publishedAt = record.published_at;

  if (typeof title !== "string" || !title.trim()) return null;
  if (typeof summary !== "string" || !summary.trim()) return null;
  if (typeof articleBody !== "string" || !articleBody.trim()) return null;
  if (category !== "legal" && category !== "health") return null;

  if (
    image_url !== undefined &&
    image_url !== null &&
    image_url !== "" &&
    parseImageUrl(image_url) === null
  ) {
    return null;
  }

  const resolvedPublishedAt = parsePublishedAt(
    publishMode,
    scheduleDate,
    publishedAt
  );
  if (resolvedPublishedAt === "invalid") return null;

  return {
    title: title.trim(),
    category,
    summary: summary.trim(),
    body: articleBody.trim(),
    image_url: parseImageUrl(image_url),
    published_at: resolvedPublishedAt,
  };
}
