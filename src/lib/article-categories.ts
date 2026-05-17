import type { ArticleCategory } from "@/types/database";
import type { LucideIcon } from "lucide-react";
import { BookOpen, PenLine, Stethoscope } from "lucide-react";

export const KNOWLEDGE_CATEGORIES: ArticleCategory[] = ["legal", "health"];

export const CATEGORY_META: Record<
  ArticleCategory,
  { label: string; icon: LucideIcon }
> = {
  legal: { label: "กฎหมาย", icon: BookOpen },
  health: { label: "สุขภาพ", icon: Stethoscope },
  author: { label: "บทความโดยผู้เขียน", icon: PenLine },
};

export function isAuthorCategory(category: ArticleCategory): boolean {
  return category === "author";
}

export function articleBasePath(category: ArticleCategory): "/knowledge" | "/author" {
  return isAuthorCategory(category) ? "/author" : "/knowledge";
}
