/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xxl: "1920px",
        "xs": { max: "767px" },
      },
    },
  },
  plugins: [],
};