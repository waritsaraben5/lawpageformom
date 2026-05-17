import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-section text-center sm:px-6">
      <h1 className="text-heading-lg font-bold">ไม่พบหน้านี้</h1>
      <p className="prose-accessible mt-4">
        หน้าที่คุณต้องการอาจถูกย้ายหรือไม่มีอยู่
      </p>
      <Link href="/" className="btn-primary mt-8 inline-flex">
        กลับหน้าแรก
      </Link>
    </div>
  );
}
