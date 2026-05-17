"use client";

import type { PublishMode } from "@/lib/articles-publish";
import { toDateInputValue } from "@/lib/articles-publish";

interface ArticlePublishFieldProps {
  publishMode: PublishMode;
  onPublishModeChange: (mode: PublishMode) => void;
  scheduleDate: string;
  onScheduleDateChange: (date: string) => void;
  existingPublishedAt?: string | null;
}

export function ArticlePublishField({
  publishMode,
  onPublishModeChange,
  scheduleDate,
  onScheduleDateChange,
  existingPublishedAt,
}: ArticlePublishFieldProps) {
  const inputClass =
    "mt-2 w-full rounded-lg border-2 border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-body-lg focus-visible:focus-ring";

  const options: { value: PublishMode; label: string; hint: string }[] = [
    {
      value: "draft",
      label: "ฉบับร่าง",
      hint: "ยังไม่แสดงบนเว็บ — เก็บไว้เตรียมเผยแพร่ทีหลัง",
    },
    {
      value: "now",
      label: "เผยแพร่ทันที",
      hint: "แสดงบนศูนย์ความรู้ทันทีหลังบันทึก",
    },
    {
      value: "schedule",
      label: "กำหนดวันเผยแพร่",
      hint: "เลือกวันที่ต้องการให้บทความปรากฏ (เวลา 09:00 น.)",
    },
  ];

  return (
    <fieldset className="space-y-3 rounded-lg border-2 border-[var(--color-border)] p-4">
      <legend className="px-1 text-body-lg font-semibold">การเผยแพร่</legend>
      <p className="text-body text-[var(--color-text-muted)]">
        สร้างหลายบทความเป็นฉบับร่าง แล้วกำหนดวันเผยแพร่ทีละสัปดาห์ได้ที่หน้าจัดการตาราง
      </p>
      <div className="space-y-2">
        {options.map((opt) => (
          <label
            key={opt.value}
            className="flex cursor-pointer gap-3 rounded-lg border-2 border-[var(--color-border)] p-3 has-[:checked]:border-[var(--color-accent)] has-[:checked]:bg-[var(--color-bg)]"
          >
            <input
              type="radio"
              name="publish_mode"
              value={opt.value}
              checked={publishMode === opt.value}
              onChange={() => onPublishModeChange(opt.value)}
              className="mt-1 h-5 w-5 shrink-0"
            />
            <span>
              <span className="block font-semibold">{opt.label}</span>
              <span className="block text-body text-[var(--color-text-muted)]">
                {opt.hint}
              </span>
            </span>
          </label>
        ))}
      </div>
      {publishMode === "schedule" && (
        <div>
          <label htmlFor="schedule_date" className="block text-body font-semibold">
            วันเผยแพร่
          </label>
          <input
            id="schedule_date"
            type="date"
            required
            value={scheduleDate}
            min={toDateInputValue(new Date().toISOString())}
            onChange={(e) => onScheduleDateChange(e.target.value)}
            className={inputClass}
          />
        </div>
      )}
      {existingPublishedAt && publishMode !== "draft" && (
        <p className="text-body text-[var(--color-text-muted)]">
          กำหนดการปัจจุบัน:{" "}
          {new Intl.DateTimeFormat("th-TH", {
            dateStyle: "long",
            timeStyle: "short",
          }).format(new Date(existingPublishedAt))}
        </p>
      )}
    </fieldset>
  );
}
