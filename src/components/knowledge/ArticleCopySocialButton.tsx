"use client";

import { useState } from "react";
import { Copy } from "lucide-react";
import type { ArticleCategory } from "@/types/database";
import { articleBasePath } from "@/lib/article-categories";
import { getSiteUrl } from "@/lib/site-url";
import { copyArticleForSocial } from "@/lib/social/copy-for-social";
import { Button } from "@/components/ui/Button";

interface ArticleCopySocialButtonProps {
  articleId: string;
  title: string;
  summary: string;
  imageUrl: string | null;
  category: ArticleCategory;
  /** When false, button is disabled (draft / not yet public). */
  canCopy?: boolean;
}

export function ArticleCopySocialButton({
  articleId,
  title,
  summary,
  imageUrl,
  category,
  canCopy = true,
}: ArticleCopySocialButtonProps) {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pageUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${articleBasePath(category)}/${articleId}`
      : `${getSiteUrl()}${articleBasePath(category)}/${articleId}`;

  async function handleCopy() {
    setLoading(true);
    setStatus(null);
    const result = await copyArticleForSocial({
      title,
      summary,
      pageUrl,
      imageUrl,
    });
    setStatus(result.message);
    setLoading(false);
  }

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="secondary"
        disabled={!canCopy || loading}
        onClick={handleCopy}
        className="inline-flex items-center gap-2"
      >
        <Copy className="h-4 w-4" aria-hidden="true" />
        {loading ? "กำลังคัดลอก..." : "คัดลอกสำหรับโพสต์โซเชียล"}
      </Button>
      {!canCopy && (
        <p className="text-body text-[var(--color-text-muted)]">
          เผยแพร่บทความก่อน จึงจะคัดลอกลิงก์สาธารณะได้
        </p>
      )}
      {canCopy && (
        <p className="text-body text-[var(--color-text-muted)]">
          คัดลอกข้อความและรูปปก (ถ้ามี) แล้วไปที่ Facebook → สร้างโพสต์ → วาง
          (Ctrl+V)
        </p>
      )}
      {status && (
        <p className="text-body font-medium text-green-800" role="status">
          {status}
        </p>
      )}
      {canCopy && imageUrl && (
        <p className="text-body text-[var(--color-text-muted)]">
          รูปปก:{" "}
          <a
            href={imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-accent)] underline"
          >
            เปิดรูปเพื่อบันทึก/แนบเพิ่ม
          </a>
        </p>
      )}
    </div>
  );
}
