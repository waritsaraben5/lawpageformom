import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminArticleGuard } from "@/components/knowledge/AdminArticleGuard";
import { ArticleForm } from "@/components/knowledge/ArticleForm";
import { getArticleById } from "@/lib/articles";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArticleById(id);
  return { title: article ? `แก้ไข: ${article.title}` : "แก้ไขบทความ" };
}

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArticleById(id);

  if (!article) {
    notFound();
  }

  return (
    <AdminArticleGuard>
      <div className="mx-auto max-w-3xl px-4 py-section sm:px-6">
        <Link
          href={`/knowledge/${id}`}
          className="text-body-lg font-semibold text-[var(--color-accent)] hover:underline focus-visible:focus-ring rounded"
        >
          ← กลับบทความ
        </Link>
        <h1 className="mt-6 text-heading-lg font-bold">แก้ไขบทความ</h1>
        <p className="prose-accessible mt-2 text-[var(--color-text-muted)]">
          {article.title}
        </p>
        <div className="mt-8">
          <ArticleForm mode="edit" article={article} />
        </div>
      </div>
    </AdminArticleGuard>
  );
}
