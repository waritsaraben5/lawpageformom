"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, Pencil } from "lucide-react";
import { PublishStatusBadge } from "@/components/knowledge/PublishStatusBadge";
import { formatThaiDate } from "@/lib/utils";
import {
  getArticlePublishStatus,
  toDateInputValue,
} from "@/lib/articles-publish";
import type { Article } from "@/types/database";
import { Button } from "@/components/ui/Button";

export function ArticleScheduleManager({ articles }: { articles: Article[] }) {
  const router = useRouter();
  const [startDate, setStartDate] = useState(toDateInputValue(new Date().toISOString()));
  const [scheduling, setScheduling] = useState(false);
  const [message, setMessage] = useState("");

  const drafts = useMemo(
    () =>
      articles.filter((a) => getArticlePublishStatus(a) === "draft"),
    [articles]
  );

  const scheduled = useMemo(
    () =>
      articles.filter((a) => getArticlePublishStatus(a) === "scheduled"),
    [articles]
  );

  const published = useMemo(
    () =>
      articles.filter((a) => getArticlePublishStatus(a) === "published"),
    [articles]
  );

  async function handleWeeklySchedule() {
    if (!drafts.length) {
      setMessage("ไม่มีฉบับร่าง — สร้างบทความและเลือก「ฉบับร่าง」ก่อน");
      return;
    }

    if (
      !confirm(
        `จัดตารางเผยแพร่ ${drafts.length} บทความ ทีละ 1 สัปดาห์ เริ่มวันที่เลือก?`
      )
    ) {
      return;
    }

    setScheduling(true);
    setMessage("");

    try {
      const res = await fetch("/api/articles/schedule-weekly", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start_date: startDate,
          article_ids: drafts.map((d) => d.id),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Schedule failed");
      }
      setMessage(`จัดตารางแล้ว ${data.scheduled} บทความ (ทีละ 1 สัปดาห์)`);
      router.refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "จัดตารางไม่สำเร็จ");
    } finally {
      setScheduling(false);
    }
  }

  return (
    <div className="space-y-10">
      <section className="card space-y-4">
        <h2 className="text-heading-sm font-bold flex items-center gap-2">
          <Calendar className="h-6 w-6" aria-hidden="true" />
          จัดตารางเผยแพร่รายสัปดาห์
        </h2>
        <p className="prose-accessible">
          เลือกวันเริ่มต้น ระบบจะกำหนดวันเผยแพร่ให้ฉบับร่างทั้งหมด ({drafts.length}{" "}
          บทความ) โดยห่างกัน 7 วัน — เหมาะสำหรับเผยแพร่ 1 บทความต่อสัปดาห์
        </p>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label htmlFor="weekly_start" className="block text-body font-semibold">
              วันเริ่มเผยแพร่บทความแรก
            </label>
            <input
              id="weekly_start"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-2 rounded-lg border-2 border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-body-lg focus-visible:focus-ring"
            />
          </div>
          <Button
            type="button"
            onClick={handleWeeklySchedule}
            disabled={scheduling || drafts.length === 0}
          >
            {scheduling ? "กำลังจัดตาราง..." : "จัดตารางรายสัปดาห์"}
          </Button>
        </div>
        {message && (
          <p className="text-body font-semibold text-[var(--color-accent)]" role="status">
            {message}
          </p>
        )}
      </section>

      <ArticleListSection title="ฉบับร่าง" items={drafts} empty="ยังไม่มีฉบับร่าง" />
      <ArticleListSection
        title="รอเผยแพร่"
        items={scheduled}
        empty="ยังไม่มีบทความที่กำหนดวันเผยแพร่"
        showPublishDate
      />
      <ArticleListSection
        title="เผยแพร่แล้ว"
        items={published}
        empty="ยังไม่มีบทความที่เผยแพร่"
        showPublishDate
      />
    </div>
  );
}

function ArticleListSection({
  title,
  items,
  empty,
  showPublishDate = false,
}: {
  title: string;
  items: Article[];
  empty: string;
  showPublishDate?: boolean;
}) {
  return (
    <section>
      <h2 className="text-heading-sm font-bold">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-4 text-body-lg text-[var(--color-text-muted)]">{empty}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((article) => (
            <li
              key={article.id}
              className="card flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold">{article.title}</span>
                  <PublishStatusBadge article={article} />
                </div>
                {showPublishDate && article.published_at && (
                  <p className="mt-1 text-body text-[var(--color-text-muted)]">
                    เผยแพร่: {formatThaiDate(article.published_at)}
                  </p>
                )}
              </div>
              <Link
                href={`/knowledge/${article.id}/edit`}
                className="btn-secondary inline-flex items-center gap-1 shrink-0"
              >
                <Pencil className="h-4 w-4" aria-hidden="true" />
                แก้ไข
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
