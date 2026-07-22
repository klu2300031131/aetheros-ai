/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#030308',
          card: 'rgba(10, 10, 20, 0.45)',
          border: 'rgba(255, 255, 255, 0.08)',
          text: '#f1f1f6',
          muted: '#8e8e9f',
          blue: '#2563eb',
          electricBlue: '#3b82f6',
          purple: '#8b5cf6',
          cyan: '#06b6d4',
          emerald: '#10b981',
          danger: '#ef4444'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'aurora': 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.15) 0%, rgba(59, 130, 246, 0.1) 40%, rgba(3, 3, 8, 0) 100%)'
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 60s linear infinite',
        'aurora-glow': 'aurora-animation 20s infinite alternate ease-in-out',
      },
      keyframes: {
        'aurora-animation': {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '50%': { transform: 'translate(20px, -20px) scale(1.1)' },
          '100%': { transform: 'translate(-20px, 20px) scale(0.95)' }
        }
      }
    },
  },
  plugins: [],
}
