import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isArticlePublic } from "@/lib/articles-publish";
import type { Article, ArticleCategory } from "@/types/database";

const SAMPLE_ARTICLES: Article[] = [
  {
    id: "sample-legal",
    title: "สิทธิสมาชิกสหกรณ์ที่ควรรู้",
    category: "legal",
    summary: "สรุปสิทธิพื้นฐานของสมาชิกตามกฎหมายสหกรณ์",
    body: "สมาชิกมีสิทธิในการเข้าร่วมประชุม ลงคะแนนเลือกตั้งคณะกรรมการ และรับทราบข้อมูลการเงินที่โปร่งใส หากมีข้อสงสัย สามารถสอบถามคณะกรรมการได้ตามระเบียบของสหกรณ์",
    image_url: null,
    published_at: new Date().toISOString(),
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
    created_at: new Date().toISOString(),
  },
];

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
  category?: ArticleCategory
): Promise<Article[]> {
  const now = new Date().toISOString();

  if (!isSupabaseConfigured()) {
    const published = SAMPLE_ARTICLES.filter(isArticlePublic);
    return category
      ? published.filter((a) => a.category === category)
      : published;
  }

  try {
    const supabase = await createClient();
    let query = supabase
      .from("articles")
      .select("*")
      .not("published_at", "is", null)
      .lte("published_at", now)
      .order("published_at", { ascending: false });

    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query;
    if (error || !data?.length) {
      const published = SAMPLE_ARTICLES.filter(isArticlePublic);
      return category
        ? published.filter((a) => a.category === category)
        : published;
    }
    return data as Article[];
  } catch {
    return SAMPLE_ARTICLES.filter(isArticlePublic);
  }
}

export async function getAllArticles(
  category?: ArticleCategory
): Promise<Article[]> {
  if (!isSupabaseConfigured()) {
    const list = category
      ? SAMPLE_ARTICLES.filter((a) => a.category === category)
      : SAMPLE_ARTICLES;
    return sortArticles(list);
  }

  try {
    const supabase = await createClient();
    let query = supabase.from("articles").select("*");

    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query;
    if (error || !data?.length) {
      return sortArticles(SAMPLE_ARTICLES);
    }
    return sortArticles(data as Article[]);
  } catch {
    return sortArticles(SAMPLE_ARTICLES);
  }
}

/** Public list, or all articles when an admin is signed in */
export async function getArticles(
  category?: ArticleCategory
): Promise<Article[]> {
  const admin = await isAdminViewer();
  if (admin) {
    return getAllArticles(category);
  }
  return getPublishedArticles(category);
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
