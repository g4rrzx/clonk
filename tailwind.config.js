/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        clonk: {
          bg: '#0a0a0f',
          card: '#14141f',
          accent: '#ff6b35',
          gold: '#ffd700',
          text: '#e0e0e0',
        },
      },
      animation: {
        'clonk-hit': 'clonkHit 0.3s ease-out',
        'coin-drop': 'coinDrop 0.6s ease-in',
        'pulse-glow': 'pulseGlow 2s infinite',
      },
      keyframes: {
        clonkHit: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)' },
        },
        coinDrop: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 107, 53, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 107, 53, 0.6)' },
        },
      },
    },
  },
  plugins: [],
};
