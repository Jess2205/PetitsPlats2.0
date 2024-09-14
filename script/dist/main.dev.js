"use strict";

var _index = require("./index.js");

// Assurez-vous que le chemin est correct
function rechercheCombinée() {
  var query = searchInput.value.trim().toLowerCase();
  var filteredRecipes = recipes;

  if (query.length >= 3) {
    filteredRecipes = filteredRecipes.filter(function (recipe) {// Logique de filtrage par texte
    });
  } // Filtrage avec les options sélectionnées (appareils, ustensiles, etc.)


  filteredRecipes = filteredRecipes.filter(function (recipe) {// Logique de filtrage par filtres avancés
  });
  (0, _index.displayRecipes)(filteredRecipes);
}