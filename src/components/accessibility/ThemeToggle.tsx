"use client";

import { Moon, Sun } from "lucide-react";
import { useAccessibility } from "@/contexts/AccessibilityContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useAccessibility();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex min-h-touch min-w-touch items-center justify-center gap-2 rounded-lg border-2 border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-body font-semibold text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-accent)] hover:bg-[var(--color-bg)] focus-visible:focus-ring"
      aria-pressed={isDark}
      aria-label={isDark ? "เปลี่ยนเป็นโหมดสว่าง" : "เปลี่ยนเป็นโหมดมืด"}
    >
      {isDark ? (
        <Sun className="h-6 w-6" aria-hidden="true" />
      ) : (
        <Moon className="h-6 w-6" aria-hidden="true" />
      )}
      <span className="hidden sm:inline">
        {isDark ? "โหมดสว่าง" : "โหมดมืด"}
      </span>
    </button>
  );
}
