import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#19332f",
        pine: "#24594f",
        meadow: "#6e9a73",
        mist: "#edf4ef",
        sun: "#e7a83e",
        cream: "#fbfaf5",
        coral: "#d96c57",
      },
      boxShadow: {
        soft: "0 18px 50px rgba(25, 51, 47, 0.09)",
      },
      fontFamily: {
        sans: ["Inter", "Avenir Next", "Segoe UI", "Helvetica Neue", "sans-serif"],
        display: ["Iowan Old Style", "Baskerville", "Times New Roman", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
