/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Design system (K72-inspired): binary black / white + one muted gray.
        ink: "#000000",
        paper: "#ffffff",
        iron: "#4d4d4d",
        // The single "spark" accent: a hand-drawn ring around ONE word per screen.
        // Ascension's brand is strictly black & white, so the spark is white.
        // Change this one value to give the ring a color.
        spark: "#ffffff",

        // Legacy aliases, only used by the internal /admin screens.
        abyss: "#000000",
        deep: "#000000",
        kelp: "#0c0c0c",
        mist: "#ffffff",
        platinum: "#ffffff",
        silver: "#bdbdbd",
        ash: "#e8e8e8",
        slate: "#8a8a8a",
        lavender: "#e8e8e8",
        line: "rgba(255,255,255,0.14)",
        line2: "rgba(255,255,255,0.28)",
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "16px",
      },
      spacing: {
        4.5: "1.125rem",
        18: "4.5rem",
        22: "5.5rem",
      },
      maxWidth: {
        page: "1600px",
      },
    },
  },
  plugins: [],
};
