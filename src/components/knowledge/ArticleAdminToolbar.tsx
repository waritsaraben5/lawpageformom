"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/Button";

interface ArticleAdminToolbarProps {
  articleId: string;
  articleTitle: string;
}

export function ArticleAdminToolbar({
  articleId,
  articleTitle,
}: ArticleAdminToolbarProps) {
  const { isAdmin, loading } = useAdmin();
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  if (loading || !isAdmin) return null;

  async function handleDelete() {
    if (!confirm(`ต้องการลบบทความ "${articleTitle}" หรือไม่?`)) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/articles/${articleId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      router.push("/knowledge");
      router.refresh();
    } catch {
      alert("ลบบทความไม่สำเร็จ");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="mt-6 flex flex-wrap gap-2 border-t border-[var(--color-border)] pt-6">
      <Link
        href={`/knowledge/${articleId}/edit`}
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
  );
}
