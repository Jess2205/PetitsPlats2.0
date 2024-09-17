"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.displayRecipes = displayRecipes;
exports.showErrorMessage = showErrorMessage;
exports.hideErrorMessage = hideErrorMessage;
exports.updateRecipeCount = updateRecipeCount;

var _recipes = require("./recipes.js");

//Ce fichier contiendra les fonctions principales pour 
//la gestion des recettes, l'affichage et la mise à jour des tags 
//et filtres.
//Responsable du filtrage combiné, de l'affichage initial 
//des recettes et des événements principaux 
//(tags, barre de recherche, etc.).
// Assure-toi que le chemin est correct
// Fonction pour afficher les recettes
function displayRecipes(recipes) {
  var mediaContainer = document.getElementById('media-container');

  if (!mediaContainer) {
    console.error('Élément #media-container non trouvé');
    return;
  }

  mediaContainer.innerHTML = ''; // Effacer les recettes existantes

  recipes.forEach(function (recipe) {
    var recipeElement = document.createElement('div');
    recipeElement.classList.add('recipe-item', 'bg-white', 'shadow-md', 'rounded-lg', 'p-6', 'mb-6', 'w-full', 'max-w-lg', 'mx-auto'); // Conteneur d'image

    var imageContainer = document.createElement('div');
    imageContainer.classList.add('relative');
    var recipeImage = document.createElement('img');
    recipeImage.src = "dataMedia/".concat(recipe.image);
    recipeImage.alt = recipe.name;
    recipeImage.classList.add('w-full', 'h-auto', 'rounded-t-lg', 'object-cover'); // Badge de temps

    var timeBadge = document.createElement('span');
    timeBadge.textContent = "".concat(recipe.time, " min");
    timeBadge.classList.add('absolute', 'top-3', 'right-3', 'bg-yellow-400', 'text-black', 'rounded-full', 'px-3', 'py-1', 'text-xs', 'font-bold'); // Titre de la recette

    var recipeTitle = document.createElement('h2');
    recipeTitle.textContent = recipe.name;
    recipeTitle.classList.add('text-xl', 'font-bold', 'mb-2', 'text-gray-900'); // Description de la recette

    var description = document.createElement('p');
    description.textContent = recipe.description;
    description.classList.add('text-base', 'my-2', 'text-gray-700'); // Ingrédients

    var ingredientsGrid = document.createElement('div');
    ingredientsGrid.classList.add('grid', 'grid-cols-2', 'gap-4', 'text-gray-700', 'mt-2');
    recipe.ingredients.forEach(function (ingredient) {
      var ingredientElement = document.createElement('div');
      ingredientElement.classList.add('flex', 'flex-col', 'text-sm', 'font-semibold');
      var ingredientName = document.createElement('span');
      ingredientName.textContent = "".concat(ingredient.ingredient);
      ingredientName.classList.add('mb-1');
      var ingredientQuantity = document.createElement('span');

      if (ingredient.quantity) {
        ingredientQuantity.textContent = "".concat(ingredient.quantity, " ").concat(ingredient.unit || '').trim();
        ingredientQuantity.classList.add('text-gray-500', 'font-normal');
      }

      ingredientElement.appendChild(ingredientName);
      ingredientElement.appendChild(ingredientQuantity);
      ingredientsGrid.appendChild(ingredientElement);
    }); // Append à la carte de recette

    imageContainer.appendChild(recipeImage);
    imageContainer.appendChild(timeBadge);
    recipeElement.appendChild(imageContainer);
    recipeElement.appendChild(recipeTitle);
    recipeElement.appendChild(description);
    recipeElement.appendChild(ingredientsGrid);
    mediaContainer.appendChild(recipeElement);
  });
} // Exemple de définition des fonctions showErrorMessage et hideErrorMessage
// Fonction pour afficher un message d'erreur avec un texte dynamique


function showErrorMessage(searchText) {
  var errorMessageElement = document.getElementById('error-message');

  if (errorMessageElement) {
    errorMessageElement.textContent = "Aucune recette ne contient \"".concat(searchText, "\". Vous pouvez chercher \"tarte aux pommes\", \"poisson\", etc.");
    errorMessageElement.style.display = 'block';
    console.log('Texte de recherche:', texteRecherche);
  }
} // Fonction pour masquer le message d'erreur


function hideErrorMessage() {
  var errorMessageElement = document.getElementById('error-message');

  if (errorMessageElement) {
    errorMessageElement.style.display = 'none';
  }
} // Fonction pour mettre à jour le compteur de recettes affichées


function updateRecipeCount(count) {
  var recipeCountElement = document.getElementById('total-recipes');

  if (recipeCountElement) {
    recipeCountElement.textContent = "".concat(count, " Recettes");
  } else {
    console.error('Élément #total-recipes non trouvé');
  }
}