"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/Button";

export default function AdminDashboardPage() {
  const { isAdmin, loading, signOut } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.replace("/admin/login");
    }
  }, [isAdmin, loading, router]);

  if (loading || !isAdmin) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-section text-body-lg">
        กำลังโหลด...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-section sm:px-6">
      <h1 className="text-heading font-bold">จัดการเนื้อหา</h1>
      <p className="prose-accessible mt-4">
        เมื่อเข้าสู่ระบบแล้ว ไปที่หน้าเว็บที่ต้องการแก้ไข แล้วกดปุ่มดินสอที่มุมข้อความเพื่อแก้ไข Inline CMS
      </p>
      <ul className="mt-8 space-y-3 text-body-lg">
        <li>
          <Link href="/" className="text-[var(--color-accent)] hover:underline focus-visible:focus-ring rounded">
            หน้าแรก
          </Link>
        </li>
        <li>
          <Link href="/about" className="text-[var(--color-accent)] hover:underline focus-visible:focus-ring rounded">
            เกี่ยวกับเจ้าของเว็บไซต์
          </Link>
        </li>
        <li>
          <Link
            href="/knowledge"
            className="text-[var(--color-accent)] hover:underline focus-visible:focus-ring rounded"
          >
            ศูนย์ความรู้ (เพิ่ม/แก้ไขบทความ)
          </Link>
        </li>
        <li>
          <Link
            href="/author"
            className="text-[var(--color-accent)] hover:underline focus-visible:focus-ring rounded"
          >
            บทความโดยผู้เขียน
          </Link>
        </li>
        <li>
          <Link
            href="/knowledge/manage"
            className="text-[var(--color-accent)] hover:underline focus-visible:focus-ring rounded"
          >
            ตารางเผยแพร่รายสัปดาห์
          </Link>
        </li>
      </ul>
      <Button
        type="button"
        variant="secondary"
        className="mt-10"
        onClick={() => signOut().then(() => router.push("/"))}
      >
        ออกจากระบบ
      </Button>
    </div>
  );
}
