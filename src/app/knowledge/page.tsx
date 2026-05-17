import { getArticles } from "@/lib/articles";
import { ArticleCard } from "@/components/knowledge/ArticleCard";
import { KnowledgeAdminBar } from "@/components/knowledge/KnowledgeAdminBar";

export const metadata = {
  title: "ศูนย์ความรู้",
};

export default async function KnowledgePage() {
  const articles = await getArticles();

  return (
    <div className="mx-auto max-w-6xl px-4 py-section sm:px-6">
      <h1 className="text-heading-lg font-bold">ศูนย์ความรู้</h1>
      <p className="prose-accessible mt-4 max-w-3xl">
        บทความด้านกฎหมายและสุขภาพสำหรับสมาชิก โดยเฉพาะผู้เกษียณ — อ่านง่าย ตัวอักษรชัด
      </p>

      <KnowledgeAdminBar />

      {articles.length === 0 ? (
        <p className="card mt-12 text-body-lg text-[var(--color-text-muted)]">
          ยังไม่มีบทความ
        </p>
      ) : (
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
