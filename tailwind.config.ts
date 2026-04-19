import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: '#050e1d',
        surface: '#081525',
        'surface-raised': '#0d1d32',
        'surface-hover': '#112240',
        gold: {
          DEFAULT: '#c9a535',
          light: '#e8c56a',
          dim: 'rgba(201,165,53,0.10)',
          border: 'rgba(201,165,53,0.18)',
          'border-hover': 'rgba(201,165,53,0.45)',
        },
        cream: {
          DEFAULT: '#f0e6cc',
          muted: '#9a8a68',
          dim: '#4a3f2a',
        },
      },
      fontFamily: {
        amiri: ['"Amiri"', 'serif'],
        scheherazade: ['"Scheherazade New"', 'serif'],
        lora: ['"Lora"', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-in': 'slideIn 0.35s cubic-bezier(0.16,1,0.3,1) forwards',
        'slide-out': 'slideOut 0.3s cubic-bezier(0.16,1,0.3,1) forwards',
        shimmer: 'shimmer 1.8s infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideIn: { from: { transform: 'translateX(100%)' }, to: { transform: 'translateX(0)' } },
        slideOut: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(100%)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
} satisfies Config
