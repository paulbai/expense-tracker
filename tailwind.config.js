/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg-color)',
        surface: 'var(--surface-color)',
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        accent: 'var(--accent-color)',
      },
      boxShadow: {
        'neu': 'var(--neu-shadow-out)',
        'neu-inset': 'var(--neu-shadow-in)',
        'neu-btn': '5px 5px 10px var(--shadow-dark), -5px -5px 10px var(--shadow-light)',
      }
    },
  },
  plugins: [],
}
