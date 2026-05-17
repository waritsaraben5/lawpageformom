"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type TextScale = 1 | 1.1 | 1.2 | 1.3;
export type ThemeMode = "light" | "dark";

interface AccessibilityContextValue {
  theme: ThemeMode;
  textScale: TextScale;
  toggleTheme: () => void;
  setTextScale: (scale: TextScale) => void;
}

const AccessibilityContext = createContext<AccessibilityContextValue | null>(
  null
);

const THEME_KEY = "mom-law-theme";
const SCALE_KEY = "mom-law-text-scale";

export function AccessibilityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [textScale, setTextScaleState] = useState<TextScale>(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_KEY) as ThemeMode | null;
    const storedScale = localStorage.getItem(SCALE_KEY);
    if (storedTheme === "light" || storedTheme === "dark") {
      setTheme(storedTheme);
    }
    if (storedScale) {
      const parsed = parseFloat(storedScale) as TextScale;
      if ([1, 1.1, 1.2, 1.3].includes(parsed)) {
        setTextScaleState(parsed);
      }
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.setProperty(
      "--text-scale",
      String(textScale)
    );
    localStorage.setItem(THEME_KEY, theme);
    localStorage.setItem(SCALE_KEY, String(textScale));
  }, [theme, textScale, mounted]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }, []);

  const setTextScale = useCallback((scale: TextScale) => {
    setTextScaleState(scale);
  }, []);

  const value = useMemo(
    () => ({ theme, textScale, toggleTheme, setTextScale }),
    [theme, textScale, toggleTheme, setTextScale]
  );

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) {
    throw new Error("useAccessibility must be used within AccessibilityProvider");
  }
  return ctx;
}
