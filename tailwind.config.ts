import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#0A0A0A",
        charcoal: "#141416",
        graphite: "#1B1B1F",
        mist: "#F5F5F5",
        tuskegee: {
          gold: "#C8A24A",
          bright: "#D4B45C",
          muted: "#8A7033",
          deep: "#6B5524",
          bronze: "#A66A30",
          ember: "#9A6B2F",
        },
        ink: {
          50: "#F5F5F5",
          100: "#E8E8EA",
          200: "#C4C4C8",
          300: "#9A9AA3",
          400: "#6E6E78",
          500: "#4A4A52",
          600: "#2E2E34",
          700: "#1B1B1F",
          800: "#121214",
          900: "#0A0A0A",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      maxWidth: {
        prose: "40rem",
        measure: "38rem",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0,0,0,0.4)",
        gold: "0 0 36px rgba(200, 162, 74, 0.14)",
        "gold-sm": "0 0 20px rgba(200, 162, 74, 0.1)",
      },
      backgroundImage: {
        "radial-fade":
          "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(200,162,74,0.08), transparent 55%)",
        "lab-grid":
          "linear-gradient(rgba(245,245,245,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(245,245,245,0.025) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "72px 72px",
      },
      keyframes: {
        "identity-spin": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "identity-spin-reverse": {
          from: { transform: "translateX(-50%) rotate(0deg)" },
          to: { transform: "translateX(-50%) rotate(-360deg)" },
        },
      },
      animation: {
        "identity-spin": "identity-spin 60s linear infinite",
        "identity-spin-reverse": "identity-spin-reverse 60s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
