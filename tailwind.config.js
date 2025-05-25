/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00C4B4', // Cyan für Akzente (ähnlich ImmoScout24)
        secondary: '#FBBF24', // Gold bleibt für abgeschlossene Schritte
        neutral: '#FFFFFF', // Weiß für Kacheln
        accent: '#E5E7EB', // Hellgrau für Linien
        background: '#FFFFFF', // Weißer Hintergrund wie bei ImmoScout24
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
