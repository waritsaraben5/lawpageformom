"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("error") === "auth_callback") {
      setError("ลิงก์รีเซ็ตรหัสผ่านหมดอายุหรือไม่ถูกต้อง กรุณาขอลิงก์ใหม่");
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!isSupabaseConfigured()) {
      setError("ยังไม่ได้ตั้งค่า Supabase — ดูไฟล์ .env.local.example");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบอีเมลและรหัสผ่าน");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="card mt-8 space-y-6">
      <div>
        <label htmlFor="email" className="block text-body-lg font-semibold">
          อีเมล
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
      <div>
        <div className="flex items-center justify-between gap-2">
          <label htmlFor="password" className="block text-body-lg font-semibold">
            รหัสผ่าน
          </label>
          <Link
            href="/admin/forgot-password"
            className="text-body font-medium text-[var(--color-accent)] hover:underline focus-visible:focus-ring rounded shrink-0"
          >
            ลืมรหัสผ่าน?
          </Link>
        </div>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full min-h-touch rounded-lg border-2 border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-body-lg focus-visible:focus-ring"
          autoComplete="current-password"
        />
      </div>
      {error && (
        <p className="text-body font-semibold text-red-700" role="alert">
          {error}
        </p>
      )}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
      </Button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-section sm:px-6">
      <h1 className="text-heading font-bold">เข้าสู่ระบบผู้ดูแล</h1>
      <p className="mt-2 text-body-lg text-[var(--color-text-muted)]">
        สำหรับแก้ไขเนื้อหาบนเว็บไซต์ (Inline CMS)
      </p>
      <Suspense
        fallback={
          <div className="card mt-8 p-6 text-body-lg">กำลังโหลด...</div>
        }
      >
        <AdminLoginForm />
      </Suspense>
      <p className="mt-6 text-center text-body-lg">
        <Link
          href="/"
          className="text-[var(--color-accent)] hover:underline focus-visible:focus-ring rounded"
        >
          กลับหน้าแรก
        </Link>
      </p>
    </div>
  );
}
