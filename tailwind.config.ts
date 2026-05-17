import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0A2240",
          light: "#1A3A5C",
        },
        cream: {
          DEFAULT: "#FAF7F0",
          dark: "#E8E4DA",
        },
        accent: {
          teal: "#1B6B6B",
          gold: "#B8860B",
        },
        surface: {
          light: "#FFFFFF",
          dark: "#0F1E33",
        },
        text: {
          primary: "var(--color-text-primary)",
          muted: "var(--color-text-muted)",
        },
      },
      fontSize: {
        "body-lg": ["calc(1.125rem * var(--text-scale, 1))", { lineHeight: "1.75" }],
        body: ["calc(1rem * var(--text-scale, 1))", { lineHeight: "1.7" }],
        "heading-lg": ["calc(2.25rem * var(--text-scale, 1))", { lineHeight: "1.2" }],
        heading: ["calc(1.75rem * var(--text-scale, 1))", { lineHeight: "1.25" }],
        "heading-sm": ["calc(1.375rem * var(--text-scale, 1))", { lineHeight: "1.3" }],
      },
      minHeight: {
        touch: "48px",
      },
      minWidth: {
        touch: "48px",
      },
      spacing: {
        section: "4rem",
      },
      fontFamily: {
        sans: [
          "var(--font-sarabun)",
          "Sarabun",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
