/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        boardBg: '#faf9f6', 
        brand: '#2b6a4a',
        brandHover: '#1e4d35',
      }
    },
  },
  plugins: [],
}