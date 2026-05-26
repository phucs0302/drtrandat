/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary:  { DEFAULT: '#0d6e6e', light: '#e6f4f4', dark: '#094f4f' },
        accent:   { DEFAULT: '#f4845f', light: '#fef0eb' },
      },
      fontFamily: {
        sans:    ['"Be Vietnam Pro"', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'serif'],
      },
    },
  },
  plugins: [],
}