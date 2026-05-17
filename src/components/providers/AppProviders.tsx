"use client";

import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import { AdminProvider } from "@/contexts/AdminContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AccessibilityProvider>
      <AdminProvider>{children}</AdminProvider>
    </AccessibilityProvider>
  );
}
