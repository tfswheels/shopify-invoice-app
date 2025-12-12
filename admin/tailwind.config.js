/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        shopify: {
          green: '#008060',
          lightgreen: '#50B83C',
          blue: '#5C6AC4',
          red: '#D82C0D',
          yellow: '#FFEA8A',
          teal: '#47C1BF',
          purple: '#9C6ADE'
        }
      }
    },
  },
  plugins: [],
}
