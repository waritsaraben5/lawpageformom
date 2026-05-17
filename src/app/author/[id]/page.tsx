import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArticleAdminToolbar } from "@/components/knowledge/ArticleAdminToolbar";
import { ArticleCoverImage } from "@/components/knowledge/ArticleCoverImage";
import { ArticlePreviewBanner } from "@/components/knowledge/ArticlePreviewBanner";
import { getArticleById } from "@/lib/articles";
import { isAuthorCategory } from "@/lib/article-categories";
import { getArticlePublishStatus } from "@/lib/articles-publish";
import { formatThaiDate } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArticleById(id);
  return { title: article?.title ?? "บทความ" };
}

export default async function AuthorArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArticleById(id);

  if (!article) {
    notFound();
  }

  if (!isAuthorCategory(article.category)) {
    redirect(`/knowledge/${id}`);
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-section sm:px-6">
      <Link
        href="/author"
        className="text-body-lg font-semibold text-[var(--color-accent)] hover:underline focus-visible:focus-ring rounded"
      >
        ← กลับบทความโดยผู้เขียน
      </Link>
      <ArticlePreviewBanner article={article} />
      {article.image_url && (
        <ArticleCoverImage
          src={article.image_url}
          alt={article.title}
          variant="hero"
          priority
          className="mt-6"
        />
      )}
      <h1
        className={`text-heading-lg font-bold ${article.image_url ? "mt-8" : "mt-6"}`}
      >
        {article.title}
      </h1>
      <p className="mt-2 text-body text-[var(--color-text-muted)]">
        {getArticlePublishStatus(article) === "published" && article.published_at
          ? `เผยแพร่: ${formatThaiDate(article.published_at)}`
          : `สร้างเมื่อ: ${formatThaiDate(article.created_at)}`}
      </p>
      <p className="mt-6 text-body-lg font-medium text-[var(--color-text-muted)]">
        {article.summary}
      </p>
      <div className="prose-accessible mt-8 whitespace-pre-wrap">{article.body}</div>
      <ArticleAdminToolbar
        article={article}
        listPath="/author"
        editPath={`/author/${article.id}/edit`}
      />
    </article>
  );
}
