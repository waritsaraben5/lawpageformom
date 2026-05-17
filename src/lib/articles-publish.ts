import type { Article } from "@/types/database";

export type ArticlePublishStatus = "draft" | "scheduled" | "published";

export type PublishMode = "draft" | "now" | "schedule";

export function getArticlePublishStatus(
  article: Pick<Article, "published_at">
): ArticlePublishStatus {
  if (!article.published_at) return "draft";

  const publishAt = new Date(article.published_at).getTime();
  if (publishAt > Date.now()) return "scheduled";

  return "published";
}

export function isArticlePublic(
  article: Pick<Article, "published_at">
): boolean {
  return getArticlePublishStatus(article) === "published";
}

export function getPublishStatusLabel(status: ArticlePublishStatus): string {
  switch (status) {
    case "draft":
      return "ฉบับร่าง";
    case "scheduled":
      return "รอเผยแพร่";
    case "published":
      return "เผยแพร่แล้ว";
  }
}

/** Local date string (YYYY-MM-DD) for date inputs */
export function toDateInputValue(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** 09:00 local time on the chosen calendar day */
export function dateInputToPublishedAt(dateValue: string): string | null {
  if (!dateValue.trim()) return null;
  const [y, m, d] = dateValue.split("-").map(Number);
  if (!y || !m || !d) return null;
  const local = new Date(y, m - 1, d, 9, 0, 0, 0);
  return local.toISOString();
}

export function resolvePublishedAt(
  mode: PublishMode,
  scheduleDate: string
): string | null {
  if (mode === "draft") return null;
  if (mode === "now") return new Date().toISOString();
  return dateInputToPublishedAt(scheduleDate);
}

export function inferPublishMode(
  publishedAt: string | null | undefined
): { mode: PublishMode; scheduleDate: string } {
  if (!publishedAt) {
    return { mode: "draft", scheduleDate: "" };
  }

  const publishAt = new Date(publishedAt).getTime();
  const now = Date.now();

  if (publishAt <= now) {
    return { mode: "now", scheduleDate: toDateInputValue(publishedAt) };
  }

  return {
    mode: "schedule",
    scheduleDate: toDateInputValue(publishedAt),
  };
}
