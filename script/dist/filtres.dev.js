"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filtrerRecettes = filtrerRecettes;
exports.mettreAJourFiltres = mettreAJourFiltres;

// Fonction pour filtrer les recettes
function filtrerRecettes(query) {
  return recettes.filter(function (recipe) {
    var lowerCaseQuery = query.toLowerCase();
    return recipe.title.toLowerCase().includes(lowerCaseQuery) || recipe.description.toLowerCase().includes(lowerCaseQuery) || recipe.ingredients.some(function (ingredient) {
      return ingredient.toLowerCase().includes(lowerCaseQuery);
    });
  });
} // Fonction pour mettre à jour les filtres dynamiquement


function mettreAJourFiltres(filteredResults) {
  var ingredientsSelect = document.getElementById('ingredients');
  var appareilsSelect = document.getElementById('appareils');
  var ustensilesSelect = document.getElementById('ustensiles'); // Réinitialiser les filtres

  ingredientsSelect.innerHTML = '<option value="">Ingrédients</option>';
  appareilsSelect.innerHTML = '<option value="">Appareils</option>';
  ustensilesSelect.innerHTML = '<option value="">Ustensiles</option>';
  var ingredients = new Set();
  var appareils = new Set();
  var ustensiles = new Set();
  filteredResults.forEach(function (result) {
    result.ingredients.forEach(function (ingredient) {
      return ingredients.add(ingredient);
    });
    result.appareils.forEach(function (appareil) {
      return appareils.add(appareil);
    });
    result.ustensiles.forEach(function (ustensile) {
      return ustensiles.add(ustensile);
    });
  });
  ingredients.forEach(function (ingredient) {
    var option = document.createElement('option');
    option.value = ingredient;
    option.textContent = ingredient;
    ingredientsSelect.appendChild(option);
  });
  appareils.forEach(function (appareil) {
    var option = document.createElement('option');
    option.value = appareil;
    option.textContent = appareil;
    appareilsSelect.appendChild(option);
  });
  ustensiles.forEach(function (ustensile) {
    var option = document.createElement('option');
    option.value = ustensile;
    option.textContent = ustensile;
    ustensilesSelect.appendChild(option);
  }); // Ajout des événements de filtrage pour les sélections

  ingredientsSelect.addEventListener('change', function () {
    return filtrerParFiltres();
  });
  appareilsSelect.addEventListener('change', function () {
    return filtrerParFiltres();
  });
  ustensilesSelect.addEventListener('change', function () {
    return filtrerParFiltres();
  });
}

function filtrerParFiltres() {
  var ingredientsSelect = document.getElementById('ingredients');
  var appareilsSelect = document.getElementById('appareils');
  var ustensilesSelect = document.getElementById('ustensiles');
  var selectedIngredients = Array.from(ingredientsSelect.selectedOptions).map(function (option) {
    return option.value;
  });
  var selectedAppareils = Array.from(appareilsSelect.selectedOptions).map(function (option) {
    return option.value;
  });
  var selectedUstensiles = Array.from(ustensilesSelect.selectedOptions).map(function (option) {
    return option.value;
  });
  var filteredResults = recettes.filter(function (recipe) {
    return (selectedIngredients.length === 0 || selectedIngredients.every(function (ingredient) {
      return recipe.ingredients.includes(ingredient);
    })) && (selectedAppareils.length === 0 || selectedAppareils.every(function (appareil) {
      return recipe.appareils.includes(appareil);
    })) && (selectedUstensiles.length === 0 || selectedUstensiles.every(function (ustensile) {
      return recipe.ustensiles.includes(ustensile);
    }));
  }); // Mettre à jour les résultats de recherche et les filtres

  updateSearchResults(filteredResults);
  mettreAJourFiltres(filteredResults);
}

function updateSearchResults(results) {
  var resultsContainer = document.getElementById('results-container');
  resultsContainer.innerHTML = '';
  results.forEach(function (result) {
    var mediaElement = document.createElement('div');
    mediaElement.className = 'result-item';
    mediaElement.innerHTML = "\n      <h3>".concat(result.title, "</h3>\n      <p>").concat(result.description, "</p>\n    ");
    resultsContainer.appendChild(mediaElement);
  });
}