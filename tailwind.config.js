/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['electron/**/*.{html,js}', 'server/html/**/*.{html,js}'],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}
