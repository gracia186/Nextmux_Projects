/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0B1220',
          900: '#101A2E',
          800: '#16223B',
          700: '#1E2C4A',
        },
        brand: {
          50: '#EEF3FF',
          100: '#DCE6FF',
          200: '#B8CCFF',
          300: '#8DAAFF',
          400: '#5F84F5',
          500: '#3D63E0',
          600: '#2C4BC0',
          700: '#233B99',
          800: '#1C2F79',
          900: '#182961',
        },
        clay: {
          400: '#E2A25C',
          500: '#D6883A',
          600: '#B96D28',
        },
        mint: {
          400: '#4FCB9B',
          500: '#2FAE81',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        soft: '0 1px 2px 0 rgba(16, 26, 46, 0.06), 0 1px 3px 0 rgba(16, 26, 46, 0.08)',
        panel: '0 8px 24px -8px rgba(16, 26, 46, 0.25)',
      },
      borderRadius: {
        xl2: '1.1rem',
      },
    },
  },
  plugins: [],
}
