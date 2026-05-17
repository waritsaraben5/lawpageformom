"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/contexts/AdminContext";

export function AdminArticleGuard({ children }: { children: React.ReactNode }) {
  const { isAdmin, loading } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.replace("/admin/login");
    }
  }, [isAdmin, loading, router]);

  if (loading || !isAdmin) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-section text-body-lg">
        กำลังโหลด...
      </div>
    );
  }

  return <>{children}</>;
}
