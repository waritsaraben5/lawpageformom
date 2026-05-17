-- Scheduled publishing for knowledge hub articles
ALTER TABLE public.articles
ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;

-- Keep existing articles visible
UPDATE public.articles
SET published_at = created_at
WHERE published_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_articles_published_at ON public.articles(published_at);

DROP POLICY IF EXISTS "Public read articles" ON public.articles;

CREATE POLICY "Public read published articles"
    ON public.articles FOR SELECT
    USING (published_at IS NOT NULL AND published_at <= NOW());
