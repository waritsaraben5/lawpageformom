import Link from "next/link";
import { AdminArticleGuard } from "@/components/knowledge/AdminArticleGuard";
import { ArticleForm } from "@/components/knowledge/ArticleForm";

export const metadata = {
  title: "เพิ่มบทความ",
};

export default function NewArticlePage() {
  return (
    <AdminArticleGuard>
      <div className="mx-auto max-w-3xl px-4 py-section sm:px-6">
        <Link
          href="/knowledge"
          className="text-body-lg font-semibold text-[var(--color-accent)] hover:underline focus-visible:focus-ring rounded"
        >
          ← กลับศูนย์ความรู้
        </Link>
        <h1 className="mt-6 text-heading-lg font-bold">เพิ่มบทความใหม่</h1>
        <p className="prose-accessible mt-2">
          กรอกหัวข้อ หมวดหมู่ สรุปย่อ และเนื้อหาบทความ
        </p>
        <div className="mt-8">
          <ArticleForm mode="create" />
        </div>
      </div>
    </AdminArticleGuard>
  );
}
