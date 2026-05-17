"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Pencil, Stethoscope, Trash2 } from "lucide-react";
import { useState } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { formatThaiDate } from "@/lib/utils";
import {
  getArticlePublishStatus,
  isArticlePublic,
} from "@/lib/articles-publish";
import type { Article } from "@/types/database";
import { ArticleCoverImage } from "@/components/knowledge/ArticleCoverImage";
import { PublishStatusBadge } from "@/components/knowledge/PublishStatusBadge";
import { Button } from "@/components/ui/Button";

const CATEGORY_LABELS = {
  legal: { label: "กฎหมาย", icon: BookOpen },
  health: { label: "สุขภาพ", icon: Stethoscope },
} as const;

export function ArticleCard({ article }: { article: Article }) {
  const { isAdmin, loading } = useAdmin();
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const cat = CATEGORY_LABELS[article.category];
  const Icon = cat.icon;
  const status = getArticlePublishStatus(article);
  const showAdminBadge = !loading && isAdmin && status !== "published";

  async function handleDelete() {
    if (
      !confirm(`ต้องการลบบทความ "${article.title}" หรือไม่?`)
    ) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/articles/${article.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      router.refresh();
    } catch {
      alert("ลบบทความไม่สำเร็จ");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <article className="card flex flex-col">
      {article.image_url && (
        <ArticleCoverImage
          src={article.image_url}
          alt={article.title}
          className="mb-4"
        />
      )}
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-2 text-body font-semibold text-[var(--color-accent)]">
          <Icon className="h-5 w-5" aria-hidden="true" />
          {cat.label}
        </span>
        {showAdminBadge && <PublishStatusBadge article={article} />}
      </div>
      <h2 className="mt-3 text-heading-sm font-bold">
        <Link
          href={`/knowledge/${article.id}`}
          className="hover:underline focus-visible:focus-ring rounded"
        >
          {article.title}
        </Link>
      </h2>
      <p className="mt-2 flex-grow text-body-lg text-[var(--color-text-muted)]">
        {article.summary}
      </p>
      <p className="mt-4 text-body text-[var(--color-text-muted)]">
        {article.published_at && status !== "draft"
          ? `เผยแพร่: ${formatThaiDate(article.published_at)}`
          : `สร้างเมื่อ: ${formatThaiDate(article.created_at)}`}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {(isArticlePublic(article) || isAdmin) && (
          <Link href={`/knowledge/${article.id}`} className="btn-secondary">
            {isArticlePublic(article) ? "อ่านต่อ" : "ดูตัวอย่าง"}
          </Link>
        )}
        {!loading && isAdmin && (
          <>
            <Link
              href={`/knowledge/${article.id}/edit`}
              className="btn-secondary inline-flex items-center gap-1"
            >
              <Pencil className="h-4 w-4" aria-hidden="true" />
              แก้ไข
            </Link>
            <Button
              type="button"
              variant="ghost"
              disabled={deleting}
              onClick={handleDelete}
              className="inline-flex items-center gap-1 text-red-700"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              {deleting ? "กำลังลบ..." : "ลบ"}
            </Button>
          </>
        )}
      </div>
    </article>
  );
}
