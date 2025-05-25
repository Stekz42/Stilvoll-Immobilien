/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#003087', // Tiefes Dunkelblau für Professionalität
        secondary: '#FFD700', // Gold für Eleganz
        neutral: '#FFFFFF', // Weiß für Klarheit
        accent: '#E5E7EB', // Hellgrau für Akzente
        background: '#F5F7FA', // Sehr helles Blau/Grau für den Hintergrund
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'input': '0 2px 4px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'xl': '1rem',
      },
    },
  },
  plugins: [],
};
