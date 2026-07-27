/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#1B140F",
          soft: "#332419",
        },
        gold: {
          deep: "#8F6416",
          DEFAULT: "#C99A34",
          bright: "#E9C46A",
        },
        parchment: {
          DEFAULT: "#F1E8D8",
          paper: "#F8F3E9",
        },
        bronze: {
          DEFAULT: "#6B5A44",
          soft: "#8C7B64",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.08)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in": "fade-in 0.5s ease both",
        marquee: "marquee var(--marquee-duration, 30s) linear infinite",
        "pulse-glow": "pulse-glow 6s ease-in-out infinite",
      },
      boxShadow: {
        card: "0 1px 2px rgba(27,20,15,0.06), 0 8px 24px rgba(27,20,15,0.06)",
      },
    },
  },
  plugins: [],
};
