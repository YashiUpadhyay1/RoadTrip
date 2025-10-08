/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // ensures all component files are scanned
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4f46e5", // Indigo (used in buttons/icons)
        accent: "#6366f1",
      },
      backgroundImage: {
        "hero-pattern": "url('/bg.jpg')", // ✅ you can use bg-hero-pattern
      },
    },
  },
  plugins: [],
};
