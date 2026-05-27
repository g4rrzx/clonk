/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      animation: {
        'clonk-hit': 'clonkHit 0.3s ease-out',
        'coin-drop': 'coinDrop 0.6s ease-out forwards',
        'pulse-glow': 'pulseGlow 2s infinite',
        'shake': 'shake 0.5s ease-in-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        clonkHit: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.85) rotate(-5deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)' },
        },
        coinDrop: {
          '0%': { transform: 'translateY(-40px) scale(0)', opacity: '0' },
          '60%': { transform: 'translateY(5px) scale(1.2)', opacity: '1' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 107, 53, 0.3)' },
          '50%': { boxShadow: '0 0 50px rgba(255, 107, 53, 0.7)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        clonk: {
          'primary': '#ff6b35',
          'primary-content': '#ffffff',
          'secondary': '#ffd700',
          'secondary-content': '#000000',
          'accent': '#7c3aed',
          'neutral': '#1a1a2e',
          'base-100': '#0a0a0f',
          'base-200': '#12121a',
          'base-300': '#1a1a28',
          'base-content': '#e0e0e0',
          'info': '#3abff8',
          'success': '#36d399',
          'warning': '#fbbd23',
          'error': '#f87272',
        },
      },
    ],
  },
};
