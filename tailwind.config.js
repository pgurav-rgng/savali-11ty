/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/**/*.html", // All HTML files
    "./public/js/**/*.js", // Specifically include JS files
    "./public/*.html", // Root HTML files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
