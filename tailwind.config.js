/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E3A8A', // Dunkelblau für Überschriften/Akzente
        secondary: '#FBBF24', // Gold als Akzent (z. B. für abgeschlossene Schritte)
        neutral: '#FFFFFF', // Weiß für Kacheln
        accent: '#D1D5DB', // Hellgrau für Linien
        background: '#F9FAFB', // Hintergrundfarbe
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'input': '0 1px 2px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'xl': '1rem',
      },
    },
  },
  plugins: [],
};
