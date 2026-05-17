-- Public bucket for site images (profile, etc.)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'site-images',
    'site-images',
    true,
    5242880,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read site images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'site-images');

CREATE POLICY "Admin upload site images"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'site-images'
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Admin update site images"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'site-images'
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Admin delete site images"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'site-images'
        AND auth.role() = 'authenticated'
    );

INSERT INTO public.content_blocks (page_key, section_key, content_text) VALUES
    ('about', 'profile_image', '')
ON CONFLICT (page_key, section_key) DO NOTHING;
