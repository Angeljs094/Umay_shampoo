/** @type {import('tailwindcss').Config} */
export default {
  // Activa las clases de Tailwind sólo en los archivos que las usan (tree-shaking)
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // ─── DESIGN SYSTEM UMAY ───────────────────────────────────────────────
      colors: {
        // Paleta ecológica premium
        sage: {
          DEFAULT: '#2C4A3E', // Sage Green – botánica, naturaleza
          dark: '#1E332B',    // Dark Forest Green – jerarquía, legibilidad
          light: '#4A7060',   // Variante clara para hovers
          50: '#F0F5F3',      // Fondo suave para cards
          100: '#D6E8E2',
          200: '#AECFBF',
          300: '#82B39F',
          400: '#5A9481',
          500: '#2C4A3E',
          600: '#1E332B',
          700: '#152622',
          800: '#0D1A18',
          900: '#060D0C',
        },
        gold: {
          DEFAULT: '#C5A880', // Earth Gold – énfasis, botones, badges
          light: '#D4BC9A',   // Hover state del gold
          dark: '#A88B62',    // Active state del gold
          50: '#FBF7F2',
          100: '#F2E8D9',
          200: '#E5D1B3',
          300: '#D4BC9A',
          400: '#C5A880',
          500: '#A88B62',
          600: '#8A6E48',
          700: '#6D5437',
        },
        cream: {
          DEFAULT: '#FAF8F5', // Warm Cream – fondo principal
          dark: '#F0EDE8',    // Fondo alternativo para secciones
          card: '#FFFFFF',    // Cards y elementos flotantes
        },
        charcoal: {
          DEFAULT: '#1E221F', // Charcoal Black – texto base
          soft: '#3D4440',    // Texto secundario
          muted: '#6B7370',   // Texto de apoyo / placeholders
        },
      },

      // ─── TIPOGRAFÍAS ──────────────────────────────────────────────────────
      fontFamily: {
        // Cinzel: serifas botánicas, elegancia herbal andina
        display: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
        // DM Sans: limpia, moderna, altamente legible en UI
        sans: ['DM Sans', 'Inter', 'system-ui', 'sans-serif'],
      },

      // ─── ESPACIADO Y TAMAÑOS ──────────────────────────────────────────────
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
        hero: ['clamp(2.5rem, 5vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'hero-sm': ['clamp(1.75rem, 3.5vw, 2.5rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },

      // ─── ANIMACIONES UMAY ─────────────────────────────────────────────────
      keyframes: {
        // Fade + deslizamiento hacia arriba (para cards y transiciones de quiz)
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // Fade suave
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        // Pulso del skeleton loader
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        // Rotación continua para el loader circular
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        // Flotación suave para el hero
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        // Escala de pulso para el badge de IA
        'pulse-scale': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
        'fade-in-up-delay': 'fade-in-up 0.5s 0.15s ease-out forwards',
        'fade-in-up-delay-2': 'fade-in-up 0.5s 0.3s ease-out forwards',
        'fade-in': 'fade-in 0.4s ease-out forwards',
        shimmer: 'shimmer 1.8s infinite linear',
        float: 'float 4s ease-in-out infinite',
        'pulse-scale': 'pulse-scale 2s ease-in-out infinite',
      },

      // ─── SOMBRAS ──────────────────────────────────────────────────────────
      boxShadow: {
        card: '0 2px 12px 0 rgba(30, 50, 43, 0.08)',
        'card-hover': '0 8px 32px 0 rgba(30, 50, 43, 0.16)',
        botanical: '0 4px 24px 0 rgba(44, 74, 62, 0.12)',
        'botanical-lg': '0 16px 48px 0 rgba(44, 74, 62, 0.2)',
        glow: '0 0 24px 0 rgba(197, 168, 128, 0.3)',
      },

      // ─── BORDES ───────────────────────────────────────────────────────────
      borderRadius: {
        botanical: '1.25rem',   // Bordes suaves tipo hoja
        card: '0.875rem',
        pill: '9999px',
      },

      // ─── TRANSICIONES ─────────────────────────────────────────────────────
      transitionDuration: {
        250: '250ms',
        400: '400ms',
      },

      // ─── BACKDROP BLUR ────────────────────────────────────────────────────
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
