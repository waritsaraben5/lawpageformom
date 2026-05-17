import type { ArticleCategory } from "@/types/database";
import { articleBasePath } from "@/lib/article-categories";

export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }
  return "http://localhost:3000";
}

export function getArticlePublicUrl(
  id: string,
  category: ArticleCategory
): string {
  return `${getSiteUrl()}${articleBasePath(category)}/${id}`;
}
