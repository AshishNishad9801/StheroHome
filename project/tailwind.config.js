/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#FAF9F6',
        beige: '#F0EDE5',
        sage: '#879780',
        'sage-light': '#A8B5A0',
        'sage-dark': '#6B7A62',
        charcoal: '#242824',
        'secondary-text': '#696D66',
        'warm-border': '#E6E2D9',
      },
      fontFamily: {
        display: ['Manrope', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'tight-hero': '-0.03em',
        'wide-nav': '0.02em',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      keyframes: {
        'ken-burns': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.08)' },
        },
      },
      animation: {
        'ken-burns': 'ken-burns 8s ease-out forwards',
      },
    },
  },
  plugins: [],
};
