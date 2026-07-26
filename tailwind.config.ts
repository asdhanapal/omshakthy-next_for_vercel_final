import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C8A15A',
          light: '#D8BC86',
          dark: '#A6823F',
        },
        navy: {
          DEFAULT: '#0B1F3A',
          light: '#12315A',
          dark: '#060D18',
        },
        brass: '#C8A15A',
        ink: '#0B1F3A',
        paper: '#FBF8F2',
        mist: '#8DB4D1',
      },
      fontFamily: {
        heading: ['Fraunces', 'Georgia', 'serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
