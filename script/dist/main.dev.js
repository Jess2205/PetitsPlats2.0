"use strict";

var _index = require("./index.js");

var _filtres = require("./filtres.js");

// Assurez-vous que le chemin est correct
// Assurez-vous que le chemin est correct
// Fonction de recherche combinée
function rechercheCombinée() {
  var searchInput = document.getElementById('search-input').value.trim().toLowerCase();
  var filteredRecipes = recipes.filter(function (recipe) {
    var matchesSearch = searchInput.length < 3 || recipe.name.toLowerCase().includes(searchInput) || recipe.ingredients.some(function (ingredient) {
      return ingredient.ingredient.toLowerCase().includes(searchInput);
    }) || recipe.description.toLowerCase().includes(searchInput);
    return matchesSearch;
  });
  (0, _index.displayRecipes)(filteredRecipes);
  (0, _filtres.filterRecipesWithAdvancedFilters)();
} // Ajouter les écouteurs d'événements


window.addEventListener('load', function () {
  var searchInput = document.getElementById('search-input');

  if (searchInput) {
    searchInput.addEventListener('input', rechercheCombinée);
  }
});