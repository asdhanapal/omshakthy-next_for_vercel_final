import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0499de',
          deep: '#037ab8',
          dark: '#037ab8',
          darker: '#025f8a',
          midnight: '#013d57',
        },
        gold: {
          DEFAULT: '#C9A227',
          light: '#D4B84A',
          dark: '#A6851E',
        },
        charcoal: '#1E293B',
        slate: '#64748B',
        ivory: '#F8F8F5',
        // Keep backward compat for existing classes
        navy: {
          DEFAULT: '#025f8a',
          light: '#037ab8',
          dark: '#013d57',
        },
        ink: '#025f8a',
        paper: '#F8F8F5',
        brass: '#C9A227',
        mist: '#8DB4D1',
      },
      fontFamily: {
        heading: ['Fraunces', 'Georgia', 'serif'],
        body: ['Inter', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #042A47 0%, #0D6BB2 50%, #063D66 100%)',
        'gradient-dark': 'linear-gradient(180deg, #021A2E 0%, #063D66 100%)',
        'gradient-card': 'linear-gradient(160deg, rgba(13, 107, 178, 0.08) 0%, rgba(201, 162, 39, 0.04) 100%)',
        'gradient-blue-gold': 'linear-gradient(135deg, #0D6BB2 0%, #095A96 60%, #C9A227 100%)',
        'gradient-radial-blue': 'radial-gradient(ellipse at center, rgba(13, 107, 178, 0.15), transparent 70%)',
      },
      boxShadow: {
        'blue-sm': '0 2px 8px rgba(13, 107, 178, 0.08)',
        'blue-md': '0 4px 24px rgba(13, 107, 178, 0.12)',
        'blue-lg': '0 12px 48px rgba(13, 107, 178, 0.18)',
        'gold': '0 4px 20px rgba(201, 162, 39, 0.15)',
      },
    },
  },
  plugins: [],
}

export default config
