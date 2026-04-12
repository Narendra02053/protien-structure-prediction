/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0F1E",
        primary: "#4C9BE8",
        secondary: "#2ECC71",
        accent: "#F39C12",
        danger: "#E74C3C",
        card: "#161B22",
      },
    },
  },
  plugins: [],
}
