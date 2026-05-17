import { FeedbackForm } from "@/components/voice/FeedbackForm";

export const metadata = {
  title: "เสียงจากสมาชิก",
};

export default function VoicePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-section sm:px-6">
      <h1 className="text-heading-lg font-bold">เสียงจากสมาชิก</h1>
      <p className="prose-accessible mt-4">
        ทุกความคิดเห็นสำคัญ — กรุณาแบ่งปันข้อเสนอแนะ ความต้องการ หรือประเด็นที่อยากให้ผู้สมัครนำไปพิจารณา
      </p>
      <div className="mt-10">
        <FeedbackForm />
      </div>
    </div>
  );
}
