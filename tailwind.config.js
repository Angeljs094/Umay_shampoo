/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        sage: {
          DEFAULT: '#2C4A3E',
          dark:    '#1E332B',
          light:   '#4A7060',
          50:      '#F0F5F3',
          100:     '#D6E8E2',
          200:     '#AECFBF',
          900:     '#0F1E19',
        },
        gold: {
          DEFAULT: '#C5A880',
          light:   '#D4BFA0',
          dark:    '#A88B60',
          50:      '#FAF6F0',
          100:     '#F0E6D4',
        },
        cream: {
          DEFAULT: '#FAF8F5',
          dark:    '#F0EDE8',
          card:    '#FFFFFF',
        },
        charcoal: {
          DEFAULT: '#1E221F',
          soft:    '#3A3F3C',
          muted:   '#6B7270',
        },
      },
      fontFamily: {
        display: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
        sans:    ['DM Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        botanical: '1.25rem',
        card:      '0.875rem',
        pill:      '9999px',
      },
      boxShadow: {
        card:           '0 2px 12px rgba(44,74,62,0.08), 0 1px 3px rgba(44,74,62,0.06)',
        'card-hover':   '0 8px 24px rgba(44,74,62,0.14), 0 2px 8px rgba(44,74,62,0.08)',
        botanical:      '0 4px 20px rgba(44,74,62,0.12), 0 1px 4px rgba(44,74,62,0.08)',
        'botanical-lg': '0 12px 40px rgba(44,74,62,0.18), 0 4px 12px rgba(44,74,62,0.10)',
        glow:           '0 0 20px rgba(44,74,62,0.25)',
      },
      keyframes: {
        'fade-in-up': {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        'pulse-scale': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%':      { transform: 'scale(1.08)' },
        },
      },
      animation: {
        'fade-in-up':   'fade-in-up 0.5s ease-out forwards',
        'fade-in':      'fade-in 0.4s ease-out forwards',
        shimmer:        'shimmer 1.8s infinite linear',
        float:          'float 3s ease-in-out infinite',
        'pulse-scale':  'pulse-scale 0.6s ease-in-out',
      },
      fontSize: {
        'hero':    ['clamp(2.5rem,6vw,4.5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'hero-sm': ['clamp(1.8rem,4vw,2.8rem)', { lineHeight: '1.1' }],
      },
    },
  },
  plugins: [],
};
