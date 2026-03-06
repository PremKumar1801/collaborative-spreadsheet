import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-syne)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      colors: {
        ink: {
          50: "#f4f4f0",
          100: "#e8e8e2",
          200: "#d0d0c8",
          300: "#b0b0a5",
          400: "#888880",
          500: "#666660",
          600: "#4a4a45",
          700: "#333330",
          800: "#1e1e1c",
          900: "#111110",
          950: "#080807",
        },
        jade: {
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
        },
        amber: {
          400: "#fbbf24",
          500: "#f59e0b",
        },
      },
    },
  },
  plugins: [],
};
export default config;
