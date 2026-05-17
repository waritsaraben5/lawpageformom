"use client";

import { useRef, useState } from "react";
import { Pencil, X, Upload } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/Button";
import { ProfileImageFrame } from "@/components/cms/ProfileImageFrame";
import { cn } from "@/lib/utils";

interface EditableImageProps {
  pageKey: string;
  sectionKey: string;
  initialUrl: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export function EditableImage({
  pageKey,
  sectionKey,
  initialUrl,
  alt,
  className,
  priority = false,
}: EditableImageProps) {
  const { isAdmin, loading } = useAdmin();
  const [imageUrl, setImageUrl] = useState(initialUrl);
  const [editing, setEditing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setError("");
    if (!file) {
      setPreview(null);
      return;
    }
    setPreview(URL.createObjectURL(file));
  }

  async function handleUpload() {
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setError("กรุณาเลือกไฟล์รูปภาพ");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("page_key", pageKey);
      formData.append("section_key", sectionKey);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setImageUrl(data.url);
      setPreview(null);
      setEditing(false);
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      setError(err instanceof Error ? err.message : "อัปโหลดไม่สำเร็จ");
    } finally {
      setUploading(false);
    }
  }

  async function handleRemove() {
    setUploading(true);
    setError("");
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page_key: pageKey,
          section_key: sectionKey,
          content_text: "",
        }),
      });
      if (!res.ok) throw new Error("Remove failed");
      setImageUrl("");
      setPreview(null);
      setEditing(false);
      if (fileRef.current) fileRef.current.value = "";
    } catch {
      setError("ลบรูปไม่สำเร็จ");
    } finally {
      setUploading(false);
    }
  }

  function cancelEdit() {
    setPreview(null);
    setEditing(false);
    setError("");
    if (fileRef.current) fileRef.current.value = "";
  }

  const displayUrl = preview || imageUrl || null;

  if (loading || !isAdmin) {
    return (
      <ProfileImageFrame
        src={displayUrl}
        alt={alt}
        className={className}
        priority={priority}
      />
    );
  }

  if (editing) {
    return (
      <div className={cn("space-y-3", className)}>
        <ProfileImageFrame src={displayUrl} alt={alt} priority={priority} />
        <div className="w-44 rounded-lg border-2 border-accent-gold bg-[var(--color-surface)] p-3 sm:w-56">
          <label
            className="block text-body font-semibold"
            htmlFor={`img-${pageKey}-${sectionKey}`}
          >
            เลือกรูปภาพใหม่
          </label>
          <input
            ref={fileRef}
            id={`img-${pageKey}-${sectionKey}`}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            className="mt-2 w-full text-body"
          />
          <p className="mt-1 text-body text-[var(--color-text-muted)]">
            JPG, PNG, WebP — สูงสุด 5 MB
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button type="button" onClick={handleUpload} disabled={uploading}>
              <Upload className="h-5 w-5" aria-hidden="true" />
              {uploading ? "กำลังอัปโหลด..." : "บันทึกรูป"}
            </Button>
            {imageUrl && (
              <Button
                type="button"
                variant="secondary"
                onClick={handleRemove}
                disabled={uploading}
              >
                ลบรูป
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              onClick={cancelEdit}
              disabled={uploading}
            >
              <X className="h-5 w-5" aria-hidden="true" />
              ยกเลิก
            </Button>
          </div>
          {error && (
            <p className="mt-2 text-body font-semibold text-red-700" role="alert">
              {error}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("group relative inline-block", className)}>
      <ProfileImageFrame src={displayUrl} alt={alt} priority={priority} />
      <button
        type="button"
        onClick={() => setEditing(true)}
        className={cn(
          "absolute -right-2 -top-2 inline-flex min-h-touch min-w-touch items-center justify-center rounded-full border-2 border-accent-gold bg-[var(--color-surface)] p-2 shadow-md transition-opacity focus-visible:focus-ring",
          "opacity-100 lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100"
        )}
        aria-label="เปลี่ยนรูปภาพ"
      >
        <Pencil className="h-5 w-5 text-accent-gold" aria-hidden="true" />
      </button>
    </div>
  );
}
