import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        night: {
          950: "#050816",
          900: "#070a1f",
          800: "#0b1230"
        }
      },
      boxShadow: {
        glow: "0 0 30px rgba(120, 180, 255, 0.25)"
      }
    }
  },
  plugins: []
} satisfies Config;

