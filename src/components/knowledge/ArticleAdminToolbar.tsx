"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { isArticlePublic } from "@/lib/articles-publish";
import type { Article } from "@/types/database";
import { ArticleCopySocialButton } from "@/components/knowledge/ArticleCopySocialButton";
import { Button } from "@/components/ui/Button";

interface ArticleAdminToolbarProps {
  article: Pick<
    Article,
    "id" | "title" | "summary" | "image_url" | "category" | "published_at"
  >;
  listPath?: string;
  editPath?: string;
}

export function ArticleAdminToolbar({
  article,
  listPath = "/knowledge",
  editPath,
}: ArticleAdminToolbarProps) {
  const editHref = editPath ?? `${listPath}/${article.id}/edit`;
  const { isAdmin, loading } = useAdmin();
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  if (loading || !isAdmin) return null;

  async function handleDelete() {
    if (!confirm(`ต้องการลบบทความ "${article.title}" หรือไม่?`)) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/articles/${article.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      router.push(listPath);
      router.refresh();
    } catch {
      alert("ลบบทความไม่สำเร็จ");
    } finally {
      setDeleting(false);
    }
  }

  const canCopy = isArticlePublic(article);

  return (
    <div className="mt-6 space-y-6 border-t border-[var(--color-border)] pt-6">
      {canCopy && (
        <ArticleCopySocialButton
          articleId={article.id}
          title={article.title}
          summary={article.summary}
          imageUrl={article.image_url}
          category={article.category}
        />
      )}
      <div className="flex flex-wrap gap-2">
        <Link
          href={editHref}
          className="btn-secondary inline-flex items-center gap-2"
        >
          <Pencil className="h-4 w-4" aria-hidden="true" />
          แก้ไขบทความ
        </Link>
        <Button
          type="button"
          variant="ghost"
          disabled={deleting}
          onClick={handleDelete}
          className="inline-flex items-center gap-2 text-red-700"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          {deleting ? "กำลังลบ..." : "ลบบทความ"}
        </Button>
      </div>
    </div>
  );
}
