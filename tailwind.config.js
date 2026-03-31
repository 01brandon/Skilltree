// tailwind configuration with custom design tokens
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // primary palette
        forest:       '#2B4A1F',
        'forest-mid': '#4A7C35',
        'forest-light':'#6A9E52',
        sage:         '#8FA974',
        'sage-light': '#C2D4AF',
        cream:        '#FAFAFA',
        ash:          '#F2F2F0',
        'ash-dark':   '#E5E5E2',
        ink:          '#0D0D0D',
        'ink-soft':   '#3A3A3A',
        'ink-muted':  '#6B6B6B',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:    ['"Google Sans"', '"DM Sans"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '8xl':  ['6rem',   { lineHeight: '1'    }],
        '9xl':  ['7.5rem', { lineHeight: '1'    }],
        '10xl': ['9rem',   { lineHeight: '0.95' }],
      },
      animation: {
        'fade-up':     'fadeUp 0.6s ease-out forwards',
        'fade-in':     'fadeIn 0.5s ease-out forwards',
        'slide-right': 'slideRight 0.6s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)'    },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideRight: {
          '0%':   { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)'     },
        },
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
    },
  },
  plugins: [],
}