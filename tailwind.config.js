/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0f1115',
        surface: '#161a22',
        'surface-2': '#1b202a',
        primary: '#98f55c',
        positive: '#34d399',
        negative: '#f87171',
        muted: '#a3a7b0'
      },
      boxShadow: {
        soft: '0 0 0 1px rgba(255,255,255,0.06), 0 6px 20px rgba(0,0,0,0.35)'
      },
      borderRadius: {
        xl2: '1.25rem'
      }
    }
  },
  plugins: []
}
