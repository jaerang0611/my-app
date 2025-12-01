/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",    // pages 폴더 안을 감시하라!
    "./components/**/*.{js,ts,jsx,tsx}", // components 폴더도 감시하라!
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}