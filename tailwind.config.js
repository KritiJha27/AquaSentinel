/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#060b16',
          900: '#0a1120',
          850: '#0d1526',
          800: '#111b30',
          700: '#1a2740',
        },
        accent: {
          cyan: '#22d3ee',
          blue: '#3b82f6',
        },
        alert: {
          advisory: '#3b82f6',
          watch: '#eab308',
          warning: '#f97316',
          emergency: '#ef4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'radial-glow': 'radial-gradient(circle at 50% 0%, rgba(34,211,238,0.12), transparent 60%)',
      },
    },
  },
  plugins: [],
}
