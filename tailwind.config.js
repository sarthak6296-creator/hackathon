/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'cursive'],
      },
      colors: {
        dungeon: {
          bg: '#0f0e17',
          panel: '#1a1825',
          border: '#3a3650',
          accent: '#f8b400',
          hp: '#ff4d6d',
          xp: '#7ee081',
          mana: '#5aa9ff',
          gold: '#ffd700',
        },
      },
      animation: {
        'pulse-fast': 'pulse 0.6s ease-in-out',
        'float-up': 'floatUp 0.9s ease-out forwards',
        'shake': 'shake 0.4s ease-in-out',
      },
      keyframes: {
        floatUp: {
          '0%': { transform: 'translateY(0)', opacity: 1 },
          '100%': { transform: 'translateY(-40px)', opacity: 0 },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        },
      },
    },
  },
  plugins: [],
}
