"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Article, ArticleCategory } from "@/types/database";
import { ArticleImageField } from "@/components/knowledge/ArticleImageField";
import { ArticlePublishField } from "@/components/knowledge/ArticlePublishField";
import { inferPublishMode, type PublishMode } from "@/lib/articles-publish";
import { Button } from "@/components/ui/Button";

const CATEGORIES: { value: ArticleCategory; label: string }[] = [
  { value: "legal", label: "กฎหมาย" },
  { value: "health", label: "สุขภาพ" },
];

interface ArticleFormProps {
  mode: "create" | "edit";
  article?: Article;
}

export function ArticleForm({ mode, article }: ArticleFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(article?.title ?? "");
  const [category, setCategory] = useState<ArticleCategory>(
    article?.category ?? "legal"
  );
  const [summary, setSummary] = useState(article?.summary ?? "");
  const [body, setBody] = useState(article?.body ?? "");
  const [imageUrl, setImageUrl] = useState(article?.image_url ?? "");
  const initialPublish = inferPublishMode(article?.published_at);
  const [publishMode, setPublishMode] = useState<PublishMode>(initialPublish.mode);
  const [scheduleDate, setScheduleDate] = useState(initialPublish.scheduleDate);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const payload = {
      title,
      category,
      summary,
      body,
      image_url: imageUrl.trim() || null,
      publish_mode: publishMode,
      schedule_date: scheduleDate,
    };
    const url =
      mode === "create" ? "/api/articles" : `/api/articles/${article!.id}`;
    const method = mode === "create" ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Save failed");
      }
      router.push(
        publishMode === "draft" ? "/knowledge/manage" : `/knowledge/${data.id}`
      );
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "บันทึกไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "mt-2 w-full rounded-lg border-2 border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-body-lg focus-visible:focus-ring";

  return (
    <form onSubmit={handleSubmit} className="card space-y-6">
      <div>
        <label htmlFor="title" className="block text-body-lg font-semibold">
          หัวข้อ
        </label>
        <input
          id="title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="category" className="block text-body-lg font-semibold">
          หมวดหมู่
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as ArticleCategory)}
          className={inputClass}
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
      <ArticleImageField
        imageUrl={imageUrl}
        onImageUrlChange={setImageUrl}
        alt={title || "รูปประกอบบทความ"}
      />
      <ArticlePublishField
        publishMode={publishMode}
        onPublishModeChange={setPublishMode}
        scheduleDate={scheduleDate}
        onScheduleDateChange={setScheduleDate}
        existingPublishedAt={article?.published_at}
      />
      <div>
        <label htmlFor="summary" className="block text-body-lg font-semibold">
          สรุปย่อ
        </label>
        <textarea
          id="summary"
          required
          rows={2}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="body" className="block text-body-lg font-semibold">
          เนื้อหา
        </label>
        <textarea
          id="body"
          required
          rows={10}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className={inputClass}
        />
      </div>
      {error && (
        <p className="text-body font-semibold text-red-700" role="alert">
          {error}
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={saving}>
          {saving
            ? "กำลังบันทึก..."
            : mode === "create"
              ? "เพิ่มบทความ"
              : "บันทึกการแก้ไข"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
          disabled={saving}
        >
          ยกเลิก
        </Button>
      </div>
    </form>
  );
}
