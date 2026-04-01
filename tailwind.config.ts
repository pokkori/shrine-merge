import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-space': '#0F0F1A',
        'midnight': '#1A1A2E',
        'glass': 'rgba(255,255,255,0.03)',
        'glass-border': 'rgba(255,255,255,0.08)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) scale(1)', opacity: '0.3' },
          '50%': { transform: 'translateY(-20px) scale(1.2)', opacity: '0.6' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)' },
          '50%': { boxShadow: '0 0 30px rgba(99, 102, 241, 0.6)' },
        },
        'score-pop': {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '60%': { transform: 'scale(1.2)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'combo-pulse': {
          '0%, 100%': { transform: 'scale(1)', filter: 'brightness(1)' },
          '50%': { transform: 'scale(1.1)', filter: 'brightness(1.4)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255,107,53,0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(255,107,53,0.8), 0 0 60px rgba(255,107,53,0.4)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'score-pop': 'score-pop 0.4s cubic-bezier(0.34,1.56,0.64,1) both',
        'combo-pulse': 'combo-pulse 0.8s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'spring-soft': 'cubic-bezier(0.25, 1.25, 0.5, 1)',
      },
      boxShadow: {
        'glow-orange': '0 0 20px rgba(255, 107, 53, 0.6), 0 0 40px rgba(255, 107, 53, 0.3)',
        'glow-gold': '0 0 20px rgba(255, 217, 61, 0.7), 0 0 40px rgba(255, 217, 61, 0.3)',
        'glow-teal': '0 0 20px rgba(78, 205, 196, 0.6), 0 0 40px rgba(78, 205, 196, 0.2)',
      },
    },
  },
  plugins: [],
};
export default config;
