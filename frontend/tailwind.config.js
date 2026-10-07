/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Inter', '-apple-system', 'sans-serif'],
        sans: ['Inter', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        background: "#0b0f19",
        surface: {
          0: "#0b0f19",
          1: "#151c2c",
          2: "#1e293b",
          3: "#334155",
        },
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
        accent: {
          blue: "#3b82f6",
          cyan: "#06b6d4",
          violet: "#8b5cf6",
          pink: "#ec4899",
          emerald: "#10b981",
          yellow: "#f59e0b",
          orange: "#f97316",
          red: "#ef4444",
        },
      },
      boxShadow: {
        'card': '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
        'card-hover': '0 20px 40px -15px rgba(0, 0, 0, 0.6)',
        'glow-indigo': '0 0 25px -5px rgba(99, 102, 241, 0.25)',
        'glow-blue': '0 0 25px -5px rgba(59, 130, 246, 0.25)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s cubic-bezier(0.4,0,0.2,1) forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-left': 'slideInLeft 0.4s ease-out forwards',
        'slide-right': 'slideInRight 0.4s ease-out forwards',
        'scale-in': 'scaleIn 0.4s ease-out forwards',
        'helix-float': 'helixFloat 4s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideInLeft: {
          from: { opacity: '0', transform: 'translateX(-20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        helixFloat: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}

