/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'card-blue': '#1a2b4a',
        'card-gold': '#d4a843',
      },
    },
  },
  plugins: [],
}