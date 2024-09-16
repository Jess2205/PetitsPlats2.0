"use strict";

var _recipes = require("./recipes.js");

var _index = require("./index.js");

// Assurez-vous que le chemin est correct
// Assurez-vous que le chemin est correct
var searchBar = document.getElementById('search-bar'); // Fonction de recherche

function searchRecipes(query) {
  var lowerCaseQuery = query.toLowerCase();

  var filteredRecipes = _recipes.recipes.filter(function (recipe) {
    return recipe.title.toLowerCase().includes(lowerCaseQuery) || recipe.ingredients.some(function (ingredient) {
      return ingredient.ingredient.toLowerCase().includes(lowerCaseQuery);
    }) || recipe.description.toLowerCase().includes(lowerCaseQuery);
  });

  displayRecipes(filteredRecipes);
  updateAdvancedFilters(filteredRecipes);
} // Affichage des recettes


function displayRecipes(recipes) {
  var recipesContainer = document.getElementById('recipes-container');
  recipesContainer.innerHTML = ''; // Efface les recettes existantes

  recipes.forEach(function (recipe) {
    var recipeElement = document.createElement('div');
    recipeElement.className = 'recipe';
    recipeElement.textContent = recipe.title;
    recipesContainer.appendChild(recipeElement);
  });
} // Mise à jour des filtres avancés


function updateAdvancedFilters(filteredRecipes) {
  var ingredientsSet = new Set();
  var appareilsSet = new Set();
  var ustensilesSet = new Set();
  filteredRecipes.forEach(function (recipe) {
    recipe.ingredients.forEach(function (ingredient) {
      return ingredientsSet.add(ingredient.ingredient);
    });
    if (recipe.appliance) appareilsSet.add(recipe.appliance);
    recipe.ustensils.forEach(function (ustensile) {
      return ustensilesSet.add(ustensile);
    });
  });
  updateSelectOptions('ingredients', ingredientsSet);
  updateSelectOptions('appareils', appareilsSet);
  updateSelectOptions('ustensiles', ustensilesSet);
} // Mise à jour des options des filtres


function updateSelectOptions(selectId, optionsSet) {
  var selectElement = document.getElementById(selectId);
  selectElement.innerHTML = '<option value="">Sélectionner...</option>';
  optionsSet.forEach(function (option) {
    var opt = document.createElement('option');
    opt.value = option;
    opt.textContent = option;
    selectElement.appendChild(opt);
  });
} // Événements de la barre de recherche


searchBar.addEventListener('input', function () {
  var query = searchBar.value.trim();

  if (query.length >= 3) {
    searchRecipes(query);
  } else {
    displayRecipes(_recipes.recipes); // Optionnel : effacer les résultats si la recherche est trop courte
  }
});