"use client";

import { useState } from "react";
import { Pencil, Check, X } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface EditableBlockProps {
  pageKey: string;
  sectionKey: string;
  initialContent: string;
  as?: "p" | "h1" | "h2" | "h3" | "span";
  className?: string;
}

export function EditableBlock({
  pageKey,
  sectionKey,
  initialContent,
  as: Tag = "p",
  className,
}: EditableBlockProps) {
  const { isAdmin, loading } = useAdmin();
  const [content, setContent] = useState(initialContent);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  async function handleSave() {
    setSaving(true);
    setStatus("idle");
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page_key: pageKey,
          section_key: sectionKey,
          content_text: draft,
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      setContent(draft);
      setEditing(false);
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !isAdmin) {
    return <Tag className={className}>{content}</Tag>;
  }

  if (editing) {
    return (
      <div className="relative rounded-lg border-2 border-accent-gold bg-[var(--color-surface)] p-4">
        <label className="sr-only" htmlFor={`edit-${pageKey}-${sectionKey}`}>
          แก้ไขเนื้อหา {sectionKey}
        </label>
        <textarea
          id={`edit-${pageKey}-${sectionKey}`}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={4}
          className="w-full rounded-lg border-2 border-[var(--color-border)] bg-[var(--color-bg)] p-3 text-body-lg text-[var(--color-text-primary)] focus-visible:focus-ring"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            type="button"
            onClick={handleSave}
            disabled={saving}
            aria-label="บันทึกการแก้ไข"
          >
            <Check className="h-5 w-5" aria-hidden="true" />
            {saving ? "กำลังบันทึก..." : "บันทึก"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setDraft(content);
              setEditing(false);
            }}
            aria-label="ยกเลิกการแก้ไข"
          >
            <X className="h-5 w-5" aria-hidden="true" />
            ยกเลิก
          </Button>
        </div>
        {status === "error" && (
          <p className="mt-2 text-body font-semibold text-red-700" role="alert">
            บันทึกไม่สำเร็จ กรุณาลองอีกครั้ง
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="group relative">
      <Tag className={className}>{content}</Tag>
      <button
        type="button"
        onClick={() => {
          setDraft(content);
          setEditing(true);
        }}
        className={cn(
          "absolute -right-2 -top-2 inline-flex min-h-touch min-w-touch items-center justify-center rounded-full border-2 border-accent-gold bg-[var(--color-surface)] p-2 shadow-md transition-opacity focus-visible:focus-ring",
          "opacity-100 lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100"
        )}
        aria-label={`แก้ไข ${sectionKey}`}
      >
        <Pencil className="h-5 w-5 text-accent-gold" aria-hidden="true" />
      </button>
    </div>
  );
}
