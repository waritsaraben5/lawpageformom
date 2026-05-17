import Link from "next/link";
import { AdminArticleGuard } from "@/components/knowledge/AdminArticleGuard";
import { ArticleScheduleManager } from "@/components/knowledge/ArticleScheduleManager";
import { getAllArticles } from "@/lib/articles";

export const metadata = {
  title: "จัดการตารางเผยแพร่",
};

export default async function KnowledgeManagePage() {
  const articles = await getAllArticles();

  return (
    <AdminArticleGuard>
      <div className="mx-auto max-w-4xl px-4 py-section sm:px-6">
        <Link
          href="/knowledge"
          className="text-body-lg font-semibold text-[var(--color-accent)] hover:underline focus-visible:focus-ring rounded"
        >
          ← กลับศูนย์ความรู้
        </Link>
        <h1 className="mt-6 text-heading-lg font-bold">จัดการตารางเผยแพร่</h1>
        <p className="prose-accessible mt-4">
          สร้างบทความเป็นฉบับร่าง จัดตารางรายสัปดาห์ แล้วระบบจะเผยแพร่อัตโนมัติเมื่อถึงวัน
        </p>
        <div className="mt-8">
          <ArticleScheduleManager articles={articles} />
        </div>
      </div>
    </AdminArticleGuard>
  );
}
