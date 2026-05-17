import { cn } from "@/lib/utils";
import {
  getArticlePublishStatus,
  getPublishStatusLabel,
} from "@/lib/articles-publish";
import type { Article } from "@/types/database";

const STATUS_STYLES = {
  draft: "bg-[var(--color-bg)] text-[var(--color-text-muted)] border-[var(--color-border)]",
  scheduled:
    "bg-amber-50 text-amber-900 border-amber-300 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-700",
  published:
    "bg-emerald-50 text-emerald-900 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-700",
} as const;

export function PublishStatusBadge({
  article,
  className,
}: {
  article: Pick<Article, "published_at">;
  className?: string;
}) {
  const status = getArticlePublishStatus(article);

  return (
    <span
      className={cn(
        "inline-flex rounded-md border px-2 py-0.5 text-body font-semibold",
        STATUS_STYLES[status],
        className
      )}
    >
      {getPublishStatusLabel(status)}
    </span>
  );
}
