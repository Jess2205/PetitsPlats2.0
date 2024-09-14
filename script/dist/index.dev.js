"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.displayRecipes = displayRecipes;

var _recipes = require("./recipes.js");

var _filtres = require("./filtres.js");

// Assurez-vous que le chemin est correct
// Fonction pour afficher les recettes
function displayRecipes(recipesToDisplay) {
  var mediaContainer = document.getElementById('media-container');
  mediaContainer.innerHTML = ''; // Efface les recettes existantes

  if (recipesToDisplay.length === 0) {
    showErrorMessage();
  } else {
    hideErrorMessage();
    recipesToDisplay.forEach(function (recipe) {
      // Création dynamique des éléments pour chaque recette
      var recipeElement = document.createElement('div');
      recipeElement.className = 'recipe-card bg-white p-4 rounded shadow-lg';
      recipeElement.innerHTML = "\n        <h3 class=\"text-xl font-bold\">".concat(recipe.name, "</h3>\n        <p>").concat(recipe.description, "</p>\n        <p><strong>Ingredients:</strong> ").concat(recipe.ingredients.map(function (ing) {
        return ing.ingredient;
      }).join(', '), "</p>\n        <p><strong>Appliance:</strong> ").concat(recipe.appliance, "</p>\n        <p><strong>Ustensils:</strong> ").concat(recipe.ustensils.join(', '), "</p>\n      ");
      mediaContainer.appendChild(recipeElement);
    });
  }
} // Ajouter les écouteurs d'événements


window.addEventListener('load', function () {
  displayRecipes(_recipes.recipes); // Affiche toutes les recettes au chargement de la page
});
var searchInput = document.getElementById('search-input');

if (searchInput) {
  searchInput.addEventListener('input', rechercheCombinée);
}

var filtres = document.querySelectorAll('#ingredients, #appareils, #ustensiles');
filtres.forEach(function (filtre) {
  if (filtre) {
    filtre.addEventListener('change', rechercheCombinée);
  }
});