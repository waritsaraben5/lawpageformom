import { getAuthorArticles } from "@/lib/articles";
import { ArticleCard } from "@/components/knowledge/ArticleCard";
import { AuthorAdminBar } from "@/components/knowledge/AuthorAdminBar";

export const metadata = {
  title: "บทความโดยผู้เขียน",
};

export default async function AuthorArticlesPage() {
  const articles = await getAuthorArticles();

  return (
    <div className="mx-auto max-w-6xl px-4 py-section sm:px-6">
      <h1 className="text-heading-lg font-bold">บทความโดยผู้เขียน</h1>
      <p className="prose-accessible mt-4 max-w-3xl">
        บทความและความคิดเห็นโดยทนายอุไร — แบ่งปันประสบการณ์และมุมมองด้านกฎหมายและชีวิตสมาชิก
      </p>

      <AuthorAdminBar />

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
