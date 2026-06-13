/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
        sans: ['Space Grotesk', 'Inter', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        background: "#0a0a0a",
        surface: {
          0: "#0a0a0a",
          1: "#141414",
          2: "#1a1a1a",
        },
        accent: {
          blue: "#7c9eff",
          cyan: "#4ecdc4",
          violet: "#c9a0ff",
          pink: "#ff6b9d",
          emerald: "#7cff6b",
          yellow: "#ffe600",
          orange: "#ff9f43",
          red: "#ff6b6b",
        },
        neo: {
          black: "#ffffff",
          bg: "#0a0a0a",
          surface: "#141414",
        },
      },
      boxShadow: {
        'neo': '6px 6px 0 #ffffff',
        'neo-sm': '4px 4px 0 #ffffff',
        'neo-lg': '10px 10px 0 #ffffff',
        'neo-accent': '6px 6px 0 #ffe600',
      },
      borderWidth: {
        '3': '3px',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s cubic-bezier(0.4,0,0.2,1) forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-left': 'slideInLeft 0.4s ease-out forwards',
        'slide-right': 'slideInRight 0.4s ease-out forwards',
        'scale-in': 'scaleIn 0.4s ease-out forwards',
        'helix-float': 'helixFloat 4s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideInLeft: {
          from: { opacity: '0', transform: 'translateX(-24px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(24px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.92)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        helixFloat: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255,230,0,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(255,230,0,0.6)' },
        },
      },
      borderRadius: {
        'neo': '0',
      },
    },
  },
  plugins: [],
}
