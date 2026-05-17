-- Cover image for knowledge hub articles
ALTER TABLE public.articles
ADD COLUMN IF NOT EXISTS image_url TEXT;
