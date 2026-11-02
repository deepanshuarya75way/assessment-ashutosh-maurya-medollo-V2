/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5", // Indigo-600
        secondary: "#EC4899", // Pink-500
        darkblue: "#1E1B4B", // Indigo-900
        lightgray: "#F8FAFC", // Slate-50
        success: "#10B981", // Emerald-500
        warning: "#F59E0B", // Amber-500
        error: "#EF4444", // Red-500
        info: "#3B82F6", // Blue-500
        accent: "#8B5CF6", // Violet-500
        neutral: {
          50: "#FAFAFA",
          100: "#F5F5F5",
          200: "#E5E5E5",
          300: "#D4D4D4",
          400: "#A3A3A3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
        }
      },
      fontSize: {
        'xxs': '0.625rem', // 10px
      },
      aspectRatio: {
        'w-4': '4',
        'h-5': '5',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-in': 'slideIn 0.5s ease-out',
        'pulse-slow': 'pulse 3s infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(255, 56, 92, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(255, 56, 92, 0.6)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
}