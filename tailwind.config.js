/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-pink': '#D63D82',
        'brand-cream': '#F4F1DE',
        'brand-green': '#84A98C',
        'brand-green-dark': '#52796F',
        'brand-dark': '#2D3436',
        'brand-muted': '#636E72',
      },
      fontFamily: {
        brand: ['Playfair Display', 'serif'],
        sans: ['Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
