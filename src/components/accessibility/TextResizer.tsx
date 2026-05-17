"use client";

import { Type } from "lucide-react";
import { useAccessibility, type TextScale } from "@/contexts/AccessibilityContext";
import { cn } from "@/lib/utils";

const SCALES: { value: TextScale; label: string }[] = [
  { value: 1, label: "ปกติ" },
  { value: 1.1, label: "+10%" },
  { value: 1.2, label: "+20%" },
  { value: 1.3, label: "+30%" },
];

export function TextResizer() {
  const { textScale, setTextScale } = useAccessibility();

  return (
    <div
      className="fixed bottom-6 left-6 z-50 flex flex-col gap-2 rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-3 shadow-lg"
      role="region"
      aria-label="ปรับขนาดตัวอักษร"
    >
      <div className="flex items-center gap-2 px-1 text-body font-semibold text-[var(--color-text-primary)]">
        <Type className="h-5 w-5" aria-hidden="true" />
        <span>ขนาดตัวอักษร</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {SCALES.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => setTextScale(value)}
            className={cn(
              "min-h-touch min-w-[3.5rem] rounded-lg px-3 py-2 text-body font-semibold transition-colors focus-visible:focus-ring",
              textScale === value
                ? "bg-navy text-cream"
                : "border-2 border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-primary)] hover:border-[var(--color-accent)]"
            )}
            aria-pressed={textScale === value}
            aria-label={`ขนาดตัวอักษร ${label}`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
