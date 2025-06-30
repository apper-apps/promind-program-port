/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
colors: {
        primary: {
          50: '#e6f3ff',
          100: '#b3d9ff',
          200: '#80ccff',
          500: '#2D9CDB',
          600: '#1e7bb8',
          700: '#156199',
        },
        secondary: {
          50: '#e8f5e8',
          100: '#c3e6c3',
          200: '#9dd49d',
          500: '#27AE60',
          600: '#1e8449',
          700: '#186538',
        },
        accent: {
          50: '#fef4e6',
          100: '#fce0b3',
          500: '#F39C12',
          600: '#d4850f',
          700: '#b8700d',
        },
surface: '#FFFFFF',
        background: '#F5F7FA',
        border: '#E5E7EB',
        muted: '#6B7280',
        danger: '#E74C3C',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        float: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
      animation: {
        'pulse-soft': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scale-in': 'scaleIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}