import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#06070b",
        panel: "rgba(14, 18, 29, 0.78)",
        line: "rgba(255, 255, 255, 0.08)",
        mint: "#4ade80",
        coral: "#fb7185",
        amber: "#fbbf24"
      },
      boxShadow: {
        glow: "0 20px 80px rgba(74, 222, 128, 0.11)",
        panel: "0 22px 80px rgba(0, 0, 0, 0.32)"
      }
    }
  },
  plugins: []
};

export default config;
