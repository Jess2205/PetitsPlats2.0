"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.displayRecipes = displayRecipes;
exports.showErrorMessage = showErrorMessage;
exports.hideErrorMessage = hideErrorMessage;

// index.js
// Fonction pour afficher les recettes
function displayRecipes(recipes) {
  var recipeContainer = document.getElementById('results-container');
  recipeContainer.innerHTML = ''; // Efface le contenu existant

  if (recipes.length === 0) {
    recipeContainer.innerHTML = '<p>Aucune recette trouvée.</p>';
    return;
  }

  recipes.forEach(function (recipe) {
    var recipeCard = document.createElement('div');
    recipeCard.className = 'recipe-card'; // Création du contenu de la carte de recette

    var recipeTitle = document.createElement('h3');
    recipeTitle.textContent = recipe.name;
    var recipeDescription = document.createElement('p');
    recipeDescription.textContent = recipe.description;
    var recipeIngredients = document.createElement('ul');
    recipe.ingredients.forEach(function (ingredient) {
      var ingredientItem = document.createElement('li');
      ingredientItem.textContent = "".concat(ingredient.ingredient, ": ").concat(ingredient.quantity || '', " ").concat(ingredient.unit || '');
      recipeIngredients.appendChild(ingredientItem);
    });
    recipeCard.appendChild(recipeTitle);
    recipeCard.appendChild(recipeDescription);
    recipeCard.appendChild(recipeIngredients);
    recipeContainer.appendChild(recipeCard);
  });
} // Fonction pour afficher le message d'erreur


function showErrorMessage() {
  var errorMessageElement = document.getElementById('error-message');

  if (errorMessageElement) {
    errorMessageElement.style.display = 'block';
    errorMessageElement.textContent = 'Aucune recette ne correspond à votre recherche.';
  }
} // Fonction pour masquer le message d'erreur


function hideErrorMessage() {
  var errorMessageElement = document.getElementById('error-message');

  if (errorMessageElement) {
    errorMessageElement.style.display = 'none';
  }
}