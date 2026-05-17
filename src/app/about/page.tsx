import { EditableBlock } from "@/components/cms/EditableBlock";
import { EditableImage } from "@/components/cms/EditableImage";
import { getPageContent } from "@/lib/content";
import { SITE_BYLINE, SITE_NAME } from "@/lib/site";

export const metadata = {
  title: "เกี่ยวกับเจ้าของเว็บไซต์",
};

export default async function AboutPage() {
  const content = await getPageContent("about");

  return (
    <div className="mx-auto max-w-4xl px-4 py-section sm:px-6">
      <h1 className="text-heading-lg font-bold text-[var(--color-text-primary)]">
        เกี่ยวกับเจ้าของเว็บไซต์
      </h1>
      <div className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-start">
        <EditableImage
          pageKey="about"
          sectionKey="profile_image"
          initialUrl={content.profile_image ?? ""}
          alt={`${SITE_NAME} ${SITE_BYLINE}`}
          priority
        />
        <EditableBlock
          pageKey="about"
          sectionKey="intro"
          initialContent={content.intro}
          className="prose-accessible flex-1 sm:pt-2"
        />
      </div>
      <section className="card mt-10">
        <h2 className="section-title">วิสัยทัศน์</h2>
        <EditableBlock
          pageKey="about"
          sectionKey="vision"
          initialContent={content.vision}
          className="prose-accessible mt-4"
        />
      </section>
      <section className="mt-10 rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-bg)] p-6">
        <h2 className="text-heading-sm font-bold">ประสบการณ์ที่สะท้อนถึงคุณค่า</h2>
        <ul className="mt-4 space-y-4 text-body-lg">
          <li>
            <strong>พยาบาลเกษียณ</strong> — ฟังและดูแลด้วยความเข้าใจ
          </li>
          <li>
            <strong>นิติศาสตร์</strong> — ปกป้องสิทธิและผลประโยชน์ของสมาชิก
          </li>
          <li>
            <strong>จิตอาสา</strong> — ทำงานเพื่อชุมชนสมาชิกด้วยหัวใจ
          </li>
        </ul>
      </section>
    </div>
  );
}
