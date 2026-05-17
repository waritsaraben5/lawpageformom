"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

export default function AdminResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setCheckingSession(false);
      return;
    }

    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session?.user) {
        setSessionReady(true);
        setCheckingSession(false);
      }
    });

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setSessionReady(true);
      }
      setCheckingSession(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");
      return;
    }

    if (password !== confirmPassword) {
      setError("รหัสผ่านทั้งสองช่องไม่ตรงกัน");
      return;
    }

    if (!isSupabaseConfigured()) {
      setError("ยังไม่ได้ตั้งค่า Supabase — ดูไฟล์ .env.local.example");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError("ตั้งรหัสผ่านใหม่ไม่สำเร็จ กรุณาขอลิงก์ใหม่");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  if (checkingSession) {
    return (
      <div className="mx-auto max-w-md px-4 py-section sm:px-6">
        <p className="text-body-lg">กำลังโหลด...</p>
      </div>
    );
  }

  if (!sessionReady) {
    return (
      <div className="mx-auto max-w-md px-4 py-section sm:px-6">
        <h1 className="text-heading font-bold">ตั้งรหัสผ่านใหม่</h1>
        <p className="card mt-8 text-body-lg" role="alert">
          ลิงก์หมดอายุหรือไม่ถูกต้อง กรุณาขอลิงก์รีเซ็ตรหัสผ่านใหม่
        </p>
        <p className="mt-6 text-center text-body-lg">
          <Link
            href="/admin/forgot-password"
            className="text-[var(--color-accent)] hover:underline focus-visible:focus-ring rounded"
          >
            ขอลิงก์ใหม่
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-section sm:px-6">
      <h1 className="text-heading font-bold">ตั้งรหัสผ่านใหม่</h1>
      <p className="mt-2 text-body-lg text-[var(--color-text-muted)]">
        กรอกรหัสผ่านใหม่สำหรับบัญชีผู้ดูแล
      </p>
      <form onSubmit={handleSubmit} className="card mt-8 space-y-6">
        <div>
          <label htmlFor="password" className="block text-body-lg font-semibold">
            รหัสผ่านใหม่
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full min-h-touch rounded-lg border-2 border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-body-lg focus-visible:focus-ring"
            autoComplete="new-password"
          />
        </div>
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-body-lg font-semibold"
          >
            ยืนยันรหัสผ่านใหม่
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-2 w-full min-h-touch rounded-lg border-2 border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-body-lg focus-visible:focus-ring"
            autoComplete="new-password"
          />
        </div>
        {error && (
          <p className="text-body font-semibold text-red-700" role="alert">
            {error}
          </p>
        )}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "กำลังบันทึก..." : "บันทึกรหัสผ่านใหม่"}
        </Button>
      </form>
    </div>
  );
}
