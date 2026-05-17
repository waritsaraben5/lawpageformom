-- Mahidol University Savings and Credit Cooperative (สอ.มม.) Campaign Site
-- Run in Supabase SQL Editor or via CLI

-- 1. Dynamic Content Table for Inline Editing
CREATE TABLE public.content_blocks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    page_key VARCHAR(50) NOT NULL,
    section_key VARCHAR(100) NOT NULL,
    content_text TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(page_key, section_key)
);

-- 2. Knowledge Hub Articles Table
CREATE TABLE public.articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('legal', 'health')),
    summary TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Voice of Members Feedback Table
CREATE TABLE public.member_feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    member_name TEXT,
    contact_info TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes
CREATE INDEX idx_content_blocks_page ON public.content_blocks(page_key);
CREATE INDEX idx_articles_category ON public.articles(category);
CREATE INDEX idx_articles_created ON public.articles(created_at DESC);
CREATE INDEX idx_member_feedback_created ON public.member_feedback(created_at DESC);

-- Row Level Security
ALTER TABLE public.content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_feedback ENABLE ROW LEVEL SECURITY;

-- Public read for content and articles
CREATE POLICY "Public read content_blocks"
    ON public.content_blocks FOR SELECT
    USING (true);

CREATE POLICY "Public read articles"
    ON public.articles FOR SELECT
    USING (true);

-- Anyone can submit feedback
CREATE POLICY "Public insert member_feedback"
    ON public.member_feedback FOR INSERT
    WITH CHECK (true);

-- Admin policies (authenticated users only)
CREATE POLICY "Admin manage content_blocks"
    ON public.content_blocks FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin manage articles"
    ON public.articles FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin read member_feedback"
    ON public.member_feedback FOR SELECT
    USING (auth.role() = 'authenticated');

-- Seed default content blocks
INSERT INTO public.content_blocks (page_key, section_key, content_text) VALUES
    ('home', 'hero_title', 'ร่วมสร้างอนาคตที่มั่นคงให้สมาชิก สอ.มม.'),
    ('home', 'hero_subtitle', 'ผู้สมัครด้วยประสบการณ์พยาบาล นิติศาสตร์ และจิตอาสา — พร้อมรับฟังและทำงานเพื่อสมาชิกทุกท่าน'),
    ('home', 'mission', 'มุ่งมั่นพัฒนาสวัสดิการ ความโปร่งใส และการบริหารจัดการที่เป็นธรรม เพื่อสมาชิกทุกวัย โดยเฉพาะผู้เกษียณ'),
    ('home', 'pillar_nursing', 'ความเอาใจใส่จากวิชาชีพพยาบาล — ฟัง ดูแล และเข้าใจความต้องการของสมาชิก'),
    ('home', 'pillar_law', 'ความรู้ด้านกฎหมาย — ปกป้องสิทธิและผลประโยชน์ของสมาชิกอย่างถูกต้อง'),
    ('home', 'pillar_volunteer', 'จิตอาสาและความไว้วางใจ — ทำงานเพื่อชุมชนสมาชิกด้วยหัวใจ'),
    ('about', 'intro', 'ผู้สมัครเป็นพยาบาลเกษียณที่ศึกษานิติศาสตร์ และทำงานอาสาสมัครเพื่อสังคม มุ่งมั่นเป็นตัวแทนที่รับฟังและทำงานเพื่อสมาชิก สอ.มม. ทุกท่าน'),
    ('about', 'vision', 'วิสัยทัศน์: สหกรณ์ที่โปร่งใส มั่นคง และใส่ใจสมาชิกทุกวัย — โดยเฉพาะผู้เกษียณที่ต้องการความชัดเจนและการบริการที่เข้าถึงได้')
ON CONFLICT (page_key, section_key) DO NOTHING;

-- Sample knowledge hub articles
INSERT INTO public.articles (title, category, summary, body) VALUES
    (
        'สิทธิสมาชิกสหกรณ์ที่ควรรู้',
        'legal',
        'สรุปสิทธิพื้นฐานของสมาชิกตามกฎหมายสหกรณ์',
        'สมาชิกมีสิทธิในการเข้าร่วมประชุม ลงคะแนนเลือกตั้งคณะกรรมการ และรับทราบข้อมูลการเงินที่โปร่งใส หากมีข้อสงสัย สามารถสอบถามคณะกรรมการได้ตามระเบียบของสหกรณ์'
    ),
    (
        'ดูแลสุขภาพหลังเกษียณ',
        'health',
        'แนวทางดูแลสุขภาพและการเงินสำหรับวัยเกษียณ',
        'การวางแผนสุขภาพและการเงินหลังเกษียณช่วยลดความกังวล ควรตรวจสุขภาพประจำปี ออกกำลังกายเบาๆ และทบทวนแผนออมทรัพย์กับที่ปรึกษาสหกรณ์'
    );
