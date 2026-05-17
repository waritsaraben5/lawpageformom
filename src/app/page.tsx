import Link from "next/link";
import { Heart, Scale, HandHeart } from "lucide-react";
import { EditableBlock } from "@/components/cms/EditableBlock";
import { getPageContent } from "@/lib/content";

export default async function HomePage() {
  const content = await getPageContent("home");

  const pillars = [
    {
      key: "pillar_nursing",
      icon: Heart,
      title: "ความเอาใจใส่ (พยาบาล)",
      label: "ไอคอนหัวใจ แสดงความเอาใจใส่",
    },
    {
      key: "pillar_law",
      icon: Scale,
      title: "ความมั่นคง (นิติศาสตร์)",
      label: "ไอคอนตาชั่ง แสดงความยุติธรรม",
    },
    {
      key: "pillar_volunteer",
      icon: HandHeart,
      title: "ความไว้วางใจ (จิตอาสา)",
      label: "ไอคอนมือหัวใจ แสดงจิตอาสา",
    },
  ] as const;

  return (
    <>
      <section className="bg-navy text-cream">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <EditableBlock
            pageKey="home"
            sectionKey="hero_title"
            initialContent={content.hero_title}
            as="h1"
            className="text-heading-lg font-bold leading-tight"
          />
          <EditableBlock
            pageKey="home"
            sectionKey="hero_subtitle"
            initialContent={content.hero_subtitle}
            as="p"
            className="mt-6 max-w-3xl text-body-lg text-cream/95"
          />
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/about" className="btn-primary">
              ทำความรู้จักเจ้าของเว็บไซต์
            </Link>
            <Link href="/voice" className="btn-secondary border-cream text-cream hover:bg-cream hover:text-navy">
              ส่งเสียงของคุณ
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-section sm:px-6">
        <h2 className="section-title">พันธกิจ</h2>
        <EditableBlock
          pageKey="home"
          sectionKey="mission"
          initialContent={content.mission}
          className="prose-accessible mt-4 max-w-3xl"
        />
      </section>

      <section className="bg-[var(--color-surface)] py-section">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="section-title text-center">จุดแข็งของผู้สมัคร</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-body-lg text-[var(--color-text-muted)]">
            ผสานประสบการณ์พยาบาล นิติศาสตร์ และจิตอาสา เพื่อบริการสมาชิกอย่างมั่นใจ
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {pillars.map(({ key, icon: Icon, title, label }) => (
              <article key={key} className="card text-center">
                <Icon
                  className="mx-auto h-12 w-12 text-[var(--color-accent)]"
                  aria-label={label}
                />
                <h3 className="mt-4 text-heading-sm font-bold">{title}</h3>
                <EditableBlock
                  pageKey="home"
                  sectionKey={key}
                  initialContent={content[key]}
                  className="prose-accessible mt-3"
                />
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
