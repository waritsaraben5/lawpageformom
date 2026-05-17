import fs from "fs";

const raw = fs.readFileSync("scripts/knowledge-30weeks.txt", "utf8");

function normalize(text) {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeSql(str) {
  return str.replace(/'/g, "''");
}

const parts = raw.split(/\[Tab\/Week\s+(\d+)\]/i);
const articles = [];

for (let i = 1; i < parts.length; i += 2) {
  const week = Number(parts[i]);
  const block = normalize(parts[i + 1] || "");

  const category = /Part\s*1|นิติรักษ์/i.test(block)
    ? "legal"
    : "health";

  const titleMatch = block.match(
    /หัวข้อ:\s*(.+?)\s*เนื\s*้\s*อหาโดยละเอียด\s*\(Full Content\):/i
  );
  const bodyMatch = block.match(
    /เนื\s*้\s*อหาโดยละเอียด\s*\(Full Content\):\s*(.+?)(?:\s*●\s*เป้าหมาย|$)/i
  );

  if (!titleMatch || !bodyMatch) {
    console.warn("Skip week", week, "- could not parse");
    continue;
  }

  const titleText = titleMatch[1].trim();
  const body = bodyMatch[1].trim();
  const title = `สัปดาห์ที่ ${week}: ${titleText}`;
  const summary =
    body.length > 220 ? `${body.slice(0, 217).trim()}...` : body;

  articles.push({
    week,
    title,
    category,
    summary,
    body,
    image_url: null,
    published_at: null,
  });
}

articles.sort((a, b) => a.week - b.week);

fs.writeFileSync(
  "scripts/knowledge-30weeks-articles.json",
  JSON.stringify(articles, null, 2),
  "utf8"
);

const sqlLines = [
  "-- Seed 30 knowledge hub articles as drafts (from PDF import)",
  "-- Run after 004_articles_publish_schedule.sql",
  "",
];

for (const a of articles) {
  sqlLines.push(
    `INSERT INTO public.articles (title, category, summary, body, image_url, published_at) VALUES (` +
      `'${escapeSql(a.title)}', ` +
      `'${a.category}', ` +
      `'${escapeSql(a.summary)}', ` +
      `'${escapeSql(a.body)}', ` +
      `NULL, ` +
      `NULL` +
      `) ON CONFLICT DO NOTHING;`
  );
  sqlLines.push("");
}

fs.writeFileSync(
  "supabase/migrations/005_seed_knowledge_30_weeks.sql",
  sqlLines.join("\n"),
  "utf8"
);

console.log("Parsed articles:", articles.length);
console.log("Wrote scripts/knowledge-30weeks-articles.json");
console.log("Wrote supabase/migrations/005_seed_knowledge_30_weeks.sql");
