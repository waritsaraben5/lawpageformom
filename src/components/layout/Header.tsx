"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/accessibility/ThemeToggle";
import { useAdmin } from "@/contexts/AdminContext";
import { cn } from "@/lib/utils";
import { SITE_BYLINE, SITE_NAME } from "@/lib/site";

const NAV_ITEMS = [
  { href: "/", label: "หน้าแรก" },
  { href: "/about", label: "เกี่ยวกับเจ้าของเว็บไซต์" },
  { href: "/knowledge", label: "ศูนย์ความรู้" },
  { href: "/author", label: "บทความโดยผู้เขียน" },
  { href: "/voice", label: "เสียงจากสมาชิก" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { isAdmin, signOut } = useAdmin();

  async function handleSignOut() {
    setOpen(false);
    await signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b-2 border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="leading-snug focus-visible:focus-ring rounded px-1 py-0.5"
        >
          <span className="block text-body-lg font-medium text-[var(--color-text-primary)]">
            {SITE_NAME}
          </span>
          <span className="block text-body text-[var(--color-text-muted)]">
            {SITE_BYLINE}
          </span>
        </Link>

        <nav
          className="hidden items-center gap-2 lg:flex"
          aria-label="เมนูหลัก"
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "min-h-touch rounded-lg px-4 py-3 text-body-lg font-semibold transition-colors focus-visible:focus-ring",
                pathname === item.href
                  ? "bg-navy text-cream"
                  : "text-[var(--color-text-primary)] hover:bg-[var(--color-bg)]"
              )}
              aria-current={pathname === item.href ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
          {isAdmin && (
            <>
              <Link
                href="/admin"
                className="min-h-touch rounded-lg px-4 py-3 text-body-lg font-semibold text-accent-gold hover:underline focus-visible:focus-ring"
              >
                จัดการเนื้อหา
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="min-h-touch rounded-lg px-4 py-3 text-body-lg font-semibold text-[var(--color-text-muted)] hover:underline focus-visible:focus-ring"
              >
                ออกจากระบบ
              </button>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex min-h-touch min-w-touch items-center justify-center rounded-lg border-2 border-[var(--color-border)] lg:hidden focus-visible:focus-ring"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "ปิดเมนู" : "เปิดเมนู"}
          >
            {open ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          className="border-t-2 border-[var(--color-border)] px-4 py-4 lg:hidden"
          aria-label="เมนูมือถือ"
        >
          <ul className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block min-h-touch rounded-lg px-4 py-3 text-body-lg font-semibold focus-visible:focus-ring",
                    pathname === item.href
                      ? "bg-navy text-cream"
                      : "text-[var(--color-text-primary)] hover:bg-[var(--color-bg)]"
                  )}
                  aria-current={pathname === item.href ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {isAdmin && (
              <>
                <li>
                  <Link
                    href="/admin"
                    onClick={() => setOpen(false)}
                    className="block min-h-touch rounded-lg px-4 py-3 text-body-lg font-semibold text-accent-gold focus-visible:focus-ring"
                  >
                    จัดการเนื้อหา
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="block w-full min-h-touch rounded-lg px-4 py-3 text-left text-body-lg font-semibold text-[var(--color-text-muted)] focus-visible:focus-ring"
                  >
                    ออกจากระบบ
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}
