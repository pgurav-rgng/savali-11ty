// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,njk,md}",
    "./public/**/*.html",
    "./_includes/**/*.{html,njk}",   // add this if using Eleventy's includes folder
    "./_layouts/**/*.{html,njk}",    // or similar if your layouts are elsewhere
  ],  
  theme: {
    extend: {
      colors: {
        yellow: tailwind.colors.yellow,
        gray: tailwind.colors.gray,
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
      },
    },
  },
  safelist: [
    "bg-yellow-500",
    "text-gray-900",
    "fixed",
    "top-4",
    "left-1/2",
    "transform",
    "-translate-x-1/2",
    "px-4",
    "py-2",
    "rounded-lg",
    "shadow-lg",
    "text-sm",
  ],
  plugins: [],
};
