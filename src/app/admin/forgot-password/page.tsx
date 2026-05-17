"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { getAdminPasswordResetRedirectUrl } from "@/lib/auth/admin-password-reset";
import { Button } from "@/components/ui/Button";

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSent(false);

    if (!isSupabaseConfigured()) {
      setError("ยังไม่ได้ตั้งค่า Supabase — ดูไฟล์ .env.local.example");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      { redirectTo: getAdminPasswordResetRedirectUrl() }
    );
    setLoading(false);

    if (resetError) {
      setError("ส่งลิงก์รีเซ็ตรหัสผ่านไม่สำเร็จ กรุณาลองอีกครั้ง");
      return;
    }

    setSent(true);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-section sm:px-6">
      <h1 className="text-heading font-bold">ลืมรหัสผ่าน</h1>
      <p className="mt-2 text-body-lg text-[var(--color-text-muted)]">
        สำหรับผู้ดูแลระบบเท่านั้น — เราจะส่งลิงก์ตั้งรหัสผ่านใหม่ไปที่อีเมลของคุณ
      </p>

      {sent ? (
        <div className="card mt-8 space-y-4">
          <p className="text-body-lg" role="status">
            หากมีบัญชีผู้ดูแลที่ใช้อีเมลนี้ คุณจะได้รับอีเมลพร้อมลิงก์ตั้งรหัสผ่านใหม่
            กรุณาตรวจสอบกล่องจดหมายและโฟลเดอร์สแปม
          </p>
          <Link
            href="/admin/login"
            className="inline-block text-[var(--color-accent)] hover:underline focus-visible:focus-ring rounded text-body-lg"
          >
            กลับไปหน้าเข้าสู่ระบบ
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="card mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="block text-body-lg font-semibold">
              อีเมลผู้ดูแล
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full min-h-touch rounded-lg border-2 border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-body-lg focus-visible:focus-ring"
              autoComplete="email"
            />
          </div>
          {error && (
            <p className="text-body font-semibold text-red-700" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "กำลังส่ง..." : "ส่งลิงก์รีเซ็ตรหัสผ่าน"}
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-body-lg">
        <Link
          href="/admin/login"
          className="text-[var(--color-accent)] hover:underline focus-visible:focus-ring rounded"
        >
          กลับหน้าเข้าสู่ระบบ
        </Link>
      </p>
    </div>
  );
}
