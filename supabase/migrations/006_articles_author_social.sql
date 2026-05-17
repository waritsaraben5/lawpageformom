-- Author articles + optional Facebook/Instagram auto-post metadata

ALTER TABLE public.articles DROP CONSTRAINT IF EXISTS articles_category_check;

ALTER TABLE public.articles
ADD CONSTRAINT articles_category_check
CHECK (category IN ('legal', 'health', 'author'));

ALTER TABLE public.articles
ADD COLUMN IF NOT EXISTS share_on_facebook BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS share_on_instagram BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS facebook_post_id TEXT,
ADD COLUMN IF NOT EXISTS instagram_post_id TEXT,
ADD COLUMN IF NOT EXISTS social_posted_at TIMESTAMPTZ;
