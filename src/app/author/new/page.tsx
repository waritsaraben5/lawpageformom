import Link from "next/link";
import { AdminArticleGuard } from "@/components/knowledge/AdminArticleGuard";
import { ArticleForm } from "@/components/knowledge/ArticleForm";

export const metadata = {
  title: "เพิ่มบทความผู้เขียน",
};

export default function NewAuthorArticlePage() {
  return (
    <AdminArticleGuard>
      <div className="mx-auto max-w-3xl px-4 py-section sm:px-6">
        <Link
          href="/author"
          className="text-body-lg font-semibold text-[var(--color-accent)] hover:underline focus-visible:focus-ring rounded"
        >
          ← กลับบทความโดยผู้เขียน
        </Link>
        <h1 className="mt-6 text-heading-lg font-bold">เพิ่มบทความผู้เขียน</h1>
        <p className="prose-accessible mt-2">
          บทความจะแสดงในหน้าบทความโดยผู้เขียน — หลังเผยแพร่ใช้ปุ่มคัดลอกสำหรับโพสต์
          Facebook ได้
        </p>
        <div className="mt-8">
          <ArticleForm mode="create" variant="author" />
        </div>
      </div>
    </AdminArticleGuard>
  );
}
