/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#0f0f23',
          blue: '#00d4aa',
          purple: '#7c3aed',
          gray: '#1e293b',
          light: '#334155'
        }
      },
      fontFamily: {
        mono: ['Fira Code', 'Monaco', 'Consolas', 'monospace']
      }
    },
  },
  plugins: [],
}
