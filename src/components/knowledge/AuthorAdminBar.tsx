"use client";

import Link from "next/link";
import { useAdmin } from "@/contexts/AdminContext";

export function AuthorAdminBar() {
  const { isAdmin, loading } = useAdmin();

  if (loading || !isAdmin) return null;

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <Link href="/author/new" className="btn-primary">
        + เพิ่มบทความผู้เขียน
      </Link>
    </div>
  );
}
