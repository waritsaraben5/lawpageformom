"use client";

import Link from "next/link";
import { useAdmin } from "@/contexts/AdminContext";

export function KnowledgeAdminBar() {
  const { isAdmin, loading } = useAdmin();

  if (loading || !isAdmin) return null;

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <Link href="/knowledge/new" className="btn-primary">
        + เพิ่มบทความ
      </Link>
      <Link href="/knowledge/manage" className="btn-secondary">
        จัดการตารางเผยแพร่
      </Link>
    </div>
  );
}
