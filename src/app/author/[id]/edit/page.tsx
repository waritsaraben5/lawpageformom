import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AdminArticleGuard } from "@/components/knowledge/AdminArticleGuard";
import { ArticleForm } from "@/components/knowledge/ArticleForm";
import { getArticleById } from "@/lib/articles";
import { isAuthorCategory } from "@/lib/article-categories";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArticleById(id, { allowUnpublished: true });
  return { title: article ? `แก้ไข: ${article.title}` : "แก้ไขบทความ" };
}

export default async function EditAuthorArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArticleById(id, { allowUnpublished: true });

  if (!article) {
    notFound();
  }

  if (!isAuthorCategory(article.category)) {
    redirect(`/knowledge/${id}/edit`);
  }

  return (
    <AdminArticleGuard>
      <div className="mx-auto max-w-3xl px-4 py-section sm:px-6">
        <Link
          href={`/author/${id}`}
          className="text-body-lg font-semibold text-[var(--color-accent)] hover:underline focus-visible:focus-ring rounded"
        >
          ← กลับบทความ
        </Link>
        <h1 className="mt-6 text-heading-lg font-bold">แก้ไขบทความผู้เขียน</h1>
        <div className="mt-8">
          <ArticleForm mode="edit" article={article} variant="author" />
        </div>
      </div>
    </AdminArticleGuard>
  );
}
