/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
      "./src/**/*.{html,js}",
      "./js_sb2/searchbox/components/SearchBox.js",
      "./js_sb2/searchbox/runner_.js",
      "./js/searchbox/**/*.{html,js}",
      "./css/*.css",
        "./css/*.scss",
            "./js_sb2/searchbox/components/**/*.{html,js,css}",


  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
