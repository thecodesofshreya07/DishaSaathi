/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#071626',
          800: '#0B1F33',
          700: '#132C48',
          600: '#1D3E64',
        },
        civic: {
          blue: '#1565C0',
          'blue-dark': '#0D47A1',
          'blue-light': '#E3F2FD',
          green: '#16805C',
          'green-light': '#E8F5E9',
          'green-badge': '#DCFCE7',
          amber: '#D98C00',
          'amber-light': '#FEF3C7',
          bg: '#F6F8FA',
          card: '#FFFFFF',
          border: '#E5E7EB',
          muted: '#64748B',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
