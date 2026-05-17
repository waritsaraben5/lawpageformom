import {
  getArticlePublishStatus,
  getPublishStatusLabel,
} from "@/lib/articles-publish";
import { formatThaiDate } from "@/lib/utils";
import type { Article } from "@/types/database";

export function ArticlePreviewBanner({
  article,
}: {
  article: Pick<Article, "published_at">;
}) {
  const status = getArticlePublishStatus(article);
  if (status === "published") return null;

  return (
    <div
      className="mt-6 rounded-lg border-2 border-amber-400 bg-amber-50 px-4 py-3 text-body-lg text-amber-950 dark:bg-amber-950/30 dark:text-amber-100"
      role="status"
    >
      <strong>{getPublishStatusLabel(status)}</strong>
      {" — "}
      {status === "draft"
        ? "บทความนี้ยังไม่แสดงต่อผู้เยี่ยมชมทั่วไป"
        : article.published_at
          ? `จะเผยแพร่อัตโนมัติเมื่อ ${formatThaiDate(article.published_at)}`
          : "ยังไม่กำหนดวันเผยแพร่"}
    </div>
  );
}
