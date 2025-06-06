// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,njk,md}", // Adjust this path to include all your Eleventy templates
    "./public/**/*.{html,js,njk,md}", // If Eleventy processes files in public
  ],
  theme: {
    extend: {},
  },
  plugins: [], // This array should be empty if you're not using official Tailwind plugins
};
