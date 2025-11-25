/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0A2B5A",
        accent: "#D61F69",
      },
      fontFamily: {
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        floating: "0 25px 60px -20px rgba(15, 23, 42, 0.25)",
      },
    },
  },
  plugins: [],
}