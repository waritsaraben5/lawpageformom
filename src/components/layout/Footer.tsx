import Link from "next/link";
import { SITE_BYLINE, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-section border-t-2 border-[var(--color-border)] bg-navy text-cream">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <p className="text-body-lg font-medium">
              {SITE_NAME} <span className="text-cream/80">{SITE_BYLINE}</span>
            </p>
            <p className="mt-3 text-body-lg text-cream/90">{SITE_DESCRIPTION}</p>
          </div>
          <div>
            <p className="text-body-lg font-semibold">ลิงก์ด่วน</p>
            <ul className="mt-3 space-y-2 text-body-lg">
              <li>
                <Link
                  href="/knowledge"
                  className="rounded underline-offset-4 hover:underline focus-visible:focus-ring"
                >
                  ศูนย์ความรู้
                </Link>
              </li>
              <li>
                <Link
                  href="/voice"
                  className="rounded underline-offset-4 hover:underline focus-visible:focus-ring"
                >
                  ส่งข้อเสนอแนะ
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/login"
                  className="rounded underline-offset-4 hover:underline focus-visible:focus-ring"
                >
                  เข้าสู่ระบบผู้ดูแล
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-8 border-t border-cream/30 pt-6 text-body text-cream/80">
          © {new Date().getFullYear()} {SITE_NAME} {SITE_BYLINE}
        </p>
      </div>
    </footer>
  );
}
