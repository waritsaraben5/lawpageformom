"use client";

import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { ArticleCoverImage } from "@/components/knowledge/ArticleCoverImage";
import { Button } from "@/components/ui/Button";

interface ArticleImageFieldProps {
  imageUrl: string;
  onImageUrlChange: (url: string) => void;
  alt: string;
}

export function ArticleImageField({
  imageUrl,
  onImageUrlChange,
  alt,
}: ArticleImageFieldProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const displayUrl = preview || imageUrl || null;

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setError("");
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_type", "article");

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      onImageUrlChange(data.url);
      setPreview(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      setPreview(null);
      setError(err instanceof Error ? err.message : "อัปโหลดไม่สำเร็จ");
    } finally {
      setUploading(false);
    }
  }

  function handleRemove() {
    onImageUrlChange("");
    setPreview(null);
    setError("");
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="space-y-3">
      <label className="block text-body-lg font-semibold">รูปประกอบบทความ</label>
      <p className="text-body text-[var(--color-text-muted)]">
        ไม่บังคับ — JPG, PNG, WebP สูงสุด 5 MB
      </p>
      <ArticleCoverImage src={displayUrl} alt={alt} variant="card" />
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        className="sr-only"
        id="article-cover-upload"
      />
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="secondary"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
        >
          <Upload className="h-5 w-5" aria-hidden="true" />
          {uploading ? "กำลังอัปโหลด..." : displayUrl ? "เปลี่ยนรูป" : "เลือกรูป"}
        </Button>
        {displayUrl && (
          <Button
            type="button"
            variant="ghost"
            disabled={uploading}
            onClick={handleRemove}
            className="text-red-700"
          >
            <X className="h-5 w-5" aria-hidden="true" />
            ลบรูป
          </Button>
        )}
      </div>
      {error && (
        <p className="text-body font-semibold text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
