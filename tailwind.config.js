/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2E5C55",
        secondary: "#D97853",
        background: "#F7F5F0",
        surface: "#FFFFFF",
        textPrimary: "#1A1A1A",
        textSecondary: "#666666",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
