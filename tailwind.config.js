/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1e3a5f',
          light: '#2d4a6f',
          dark: '#152a47',
        },
        secondary: {
          DEFAULT: '#475569',
          light: '#64748b',
          dark: '#334155',
        },
        accent: {
          DEFAULT: '#d4af37',
          light: '#e0c050',
          dark: '#b8951f',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
