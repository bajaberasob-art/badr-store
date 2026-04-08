/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // هذا السطر هو الأهم عشان يقرأ كل صفحاتك
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}

