/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",        // Pour le fichier HTML à la racine
    "./script/**/*.js",    // Pour tous les fichiers JS dans le dossier 'script'
  ],
  theme: {
    extend: {
      fontFamily: {
        anton: ['Anton', 'sans-serif'],  // Ajoute la police Anton
      },
    },
  },
  plugins: [],
}


