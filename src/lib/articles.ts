import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isArticlePublic } from "@/lib/articles-publish";
import { KNOWLEDGE_CATEGORIES } from "@/lib/article-categories";
import type { Article, ArticleCategory } from "@/types/database";

export type ArticleListFilter = {
  category?: ArticleCategory;
  categories?: ArticleCategory[];
};

const SAMPLE_ARTICLES: Article[] = [
  {
    id: "sample-legal",
    title: "สิทธิสมาชิกสหกรณ์ที่ควรรู้",
    category: "legal",
    summary: "สรุปสิทธิพื้นฐานของสมาชิกตามกฎหมายสหกรณ์",
    body: "สมาชิกมีสิทธิในการเข้าร่วมประชุม ลงคะแนนเลือกตั้งคณะกรรมการ และรับทราบข้อมูลการเงินที่โปร่งใส หากมีข้อสงสัย สามารถสอบถามคณะกรรมการได้ตามระเบียบของสหกรณ์",
    image_url: null,
    published_at: new Date().toISOString(),
    share_on_facebook: false,
    share_on_instagram: false,
    facebook_post_id: null,
    instagram_post_id: null,
    social_posted_at: null,
    created_at: new Date().toISOString(),
  },
  {
    id: "sample-health",
    title: "ดูแลสุขภาพหลังเกษียณ",
    category: "health",
    summary: "แนวทางดูแลสุขภาพและการเงินสำหรับวัยเกษียณ",
    body: "การวางแผนสุขภาพและการเงินหลังเกษียณช่วยลดความกังวล ควรตรวจสุขภาพประจำปี ออกกำลังกายเบาๆ และทบทวนแผนออมทรัพย์กับที่ปรึกษาสหกรณ์",
    image_url: null,
    published_at: new Date().toISOString(),
    share_on_facebook: false,
    share_on_instagram: false,
    facebook_post_id: null,
    instagram_post_id: null,
    social_posted_at: null,
    created_at: new Date().toISOString(),
  },
];

function matchesFilter(article: Article, filter?: ArticleListFilter): boolean {
  if (!filter) return true;
  if (filter.category) return article.category === filter.category;
  if (filter.categories?.length) {
    return filter.categories.includes(article.category);
  }
  return true;
}

function applySupabaseCategoryFilter<T extends { eq: (c: string, v: string) => T; in: (c: string, v: string[]) => T }>(
  query: T,
  filter?: ArticleListFilter
): T {
  if (filter?.category) return query.eq("category", filter.category);
  if (filter?.categories?.length) return query.in("category", filter.categories);
  return query;
}

async function isAdminViewer(): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return Boolean(user);
  } catch {
    return false;
  }
}

function sortArticles(articles: Article[]): Article[] {
  return [...articles].sort((a, b) => {
    const aPub = a.published_at ? new Date(a.published_at).getTime() : Infinity;
    const bPub = b.published_at ? new Date(b.published_at).getTime() : Infinity;
    if (aPub !== bPub) return aPub - bPub;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

export async function getPublishedArticles(
  filter?: ArticleListFilter
): Promise<Article[]> {
  const now = new Date().toISOString();

  if (!isSupabaseConfigured()) {
    const published = SAMPLE_ARTICLES.filter(
      (a) => isArticlePublic(a) && matchesFilter(a, filter)
    );
    return published;
  }

  try {
    const supabase = await createClient();
    let query = supabase
      .from("articles")
      .select("*")
      .not("published_at", "is", null)
      .lte("published_at", now)
      .order("published_at", { ascending: false });

    query = applySupabaseCategoryFilter(query, filter);

    const { data, error } = await query;
    if (error || !data?.length) {
      return SAMPLE_ARTICLES.filter(
        (a) => isArticlePublic(a) && matchesFilter(a, filter)
      );
    }
    return data as Article[];
  } catch {
    return SAMPLE_ARTICLES.filter(
      (a) => isArticlePublic(a) && matchesFilter(a, filter)
    );
  }
}

export async function getAllArticles(
  filter?: ArticleListFilter
): Promise<Article[]> {
  if (!isSupabaseConfigured()) {
    const list = SAMPLE_ARTICLES.filter((a) => matchesFilter(a, filter));
    return sortArticles(list);
  }

  try {
    const supabase = await createClient();
    let query = supabase.from("articles").select("*");
    query = applySupabaseCategoryFilter(query, filter);

    const { data, error } = await query;
    if (error || !data?.length) {
      return sortArticles(
        SAMPLE_ARTICLES.filter((a) => matchesFilter(a, filter))
      );
    }
    return sortArticles(data as Article[]);
  } catch {
    return sortArticles(SAMPLE_ARTICLES.filter((a) => matchesFilter(a, filter)));
  }
}

/** Public list, or all articles when an admin is signed in */
export async function getArticles(
  filter?: ArticleListFilter
): Promise<Article[]> {
  const admin = await isAdminViewer();
  if (admin) {
    return getAllArticles(filter);
  }
  return getPublishedArticles(filter);
}

export async function getKnowledgeArticles(): Promise<Article[]> {
  return getArticles({ categories: [...KNOWLEDGE_CATEGORIES] });
}

export async function getAuthorArticles(): Promise<Article[]> {
  return getArticles({ category: "author" });
}

export async function getArticleById(
  id: string,
  options?: { allowUnpublished?: boolean }
): Promise<Article | null> {
  const allowUnpublished = options?.allowUnpublished ?? (await isAdminViewer());

  if (!isSupabaseConfigured()) {
    const article = SAMPLE_ARTICLES.find((a) => a.id === id) ?? null;
    if (!article) return null;
    if (!allowUnpublished && !isArticlePublic(article)) return null;
    return article;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      const article = SAMPLE_ARTICLES.find((a) => a.id === id) ?? null;
      if (!article) return null;
      if (!allowUnpublished && !isArticlePublic(article)) return null;
      return article;
    }

    const article = data as Article;
    if (!allowUnpublished && !isArticlePublic(article)) return null;
    return article;
  } catch {
    return null;
  }
}
