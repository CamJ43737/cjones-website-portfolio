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
        graphite: "#1B1B1F",
        mist: "#F5F5F5",
        cyan: {
          electric: "#3DD9FF",
          dim: "#1A8FA8",
        },
        tuskegee: {
          gold: "#C8A24A",
          muted: "#8A7033",
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
      boxShadow: {
        glass: "0 8px 32px rgba(0,0,0,0.35)",
        glow: "0 0 40px rgba(61, 217, 255, 0.15)",
        gold: "0 0 40px rgba(200, 162, 74, 0.12)",
      },
      backgroundImage: {
        "radial-fade":
          "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(61,217,255,0.12), transparent 55%)",
        "lab-grid":
          "linear-gradient(rgba(245,245,245,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(245,245,245,0.03) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "64px 64px",
      },
      animation: {
        "fade-up": "fadeUp 0.8s ease forwards",
        float: "float 8s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
