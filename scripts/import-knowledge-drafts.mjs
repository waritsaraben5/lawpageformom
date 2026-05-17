/**
 * Import draft articles from scripts/knowledge-30weeks-articles.json into Supabase.
 * Usage: node scripts/import-knowledge-drafts.mjs
 */
import fs from "fs";
import { createClient } from "@supabase/supabase-js";

function loadEnv() {
  const path = ".env.local";
  if (!fs.existsSync(path)) {
    throw new Error("Missing .env.local");
  }
  for (const line of fs.readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    process.env[key] = val;
  }
}

loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Need NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const articles = JSON.parse(
  fs.readFileSync("scripts/knowledge-30weeks-articles.json", "utf8")
);

const supabase = createClient(url, serviceKey);

const { data: existing, error: listError } = await supabase
  .from("articles")
  .select("title")
  .like("title", "สัปดาห์ที่ %");

if (listError) {
  console.error(listError.message);
  process.exit(1);
}

if (existing?.length >= 30) {
  console.log(`Already have ${existing.length} weekly articles — skipping import.`);
  process.exit(0);
}

let inserted = 0;
for (const article of articles) {
  const { error } = await supabase.from("articles").insert({
    title: article.title,
    category: article.category,
    summary: article.summary,
    body: article.body,
    image_url: article.image_url,
    published_at: null,
  });

  if (error) {
    console.error(`Week ${article.week}:`, error.message);
  } else {
    inserted++;
  }
}

console.log(`Imported ${inserted} draft articles (ฉบับร่าง).`);
console.log("Go to /knowledge/manage to schedule weekly publishing.");
