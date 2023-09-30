/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#120B48", 600: "#100A42", 300: "#100A42", 400: "#413C6D", 200: "#928FAB" }
      }
    },
  },
  plugins: [],
}