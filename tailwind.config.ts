import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        terminal: {
          black: "#0a0a0a",
          green: "#00ff00",
          magenta: "#ff00ff",
          dim: "#004400",
        },
      },
      keyframes: {
        scanline: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(100%)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      animation: {
        scanline: "scanline 8s linear infinite",
        blink: "blink 1s step-start infinite",
      },
      fontFamily: {
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundColor: {
        dashboard: {
          base: "#0A1929",
          card: "rgba(59, 130, 246, 0.1)",
        },
      },
      borderColor: {
        dashboard: {
          card: "rgba(59, 130, 246, 0.2)",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;