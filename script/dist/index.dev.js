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
    recipeElement.classList.add('recipe-item', 'bg-white', 'shadow-md', 'rounded-lg', 'mb-6', 'line-clamp-4', 'h-auto'); // Conteneur d'image

    var imageContainer = document.createElement('div');
    imageContainer.classList.add('relative');
    var recipeImage = document.createElement('img');
    recipeImage.src = "dataMedia/".concat(recipe.image);
    recipeImage.alt = recipe.name;
    recipeImage.classList.add('w-full', 'h-60', 'rounded-t-lg', 'object-cover', 'pb-2'); // Badge de temps

    var timeBadge = document.createElement('span');
    timeBadge.textContent = "".concat(recipe.time, " min");
    timeBadge.classList.add('absolute', 'top-2', 'right-3', 'bg-yellow-400', 'text-black', 'rounded-full', 'px-3', 'py-1', 'text-xs', 'font-bold'); // Titre de la recette

    var recipeTitle = document.createElement('h2');
    recipeTitle.textContent = recipe.name;
    recipeTitle.classList.add('text-xl', 'font-bold', 'mb-2', 'text-gray-900', 'pb-4', 'py-4', 'px-4'); // Label recette

    var recipeLabel = document.createElement('h3');
    recipeLabel.textContent = "RECETTE";
    recipeLabel.classList.add('text-m', 'py-2', 'px-4', 'text-gray-700'); // Description de la recette

    var description = document.createElement('p');
    description.textContent = recipe.description;
    description.classList.add('text-base', 'py-2', 'px-4', 'w-84', 'my-2', 'text-m', 'text-gray-900', 'pb-8', 'h-32', 'overflow-hidden'); // Label ingrédients

    var ingredientLabel = document.createElement('h3');
    ingredientLabel.textContent = "INGREDIENTS";
    ingredientLabel.classList.add('text-m', 'py-4', 'px-4', 'text-gray-700'); // Ingrédients

    var ingredientsGrid = document.createElement('div');
    ingredientsGrid.classList.add('grid', 'py-1', 'px-4', 'grid-cols-2', 'gap-4', 'text-gray-700');
    recipe.ingredients.forEach(function (ingredient) {
      var ingredientElement = document.createElement('div');
      ingredientElement.classList.add('flex', 'flex-col', 'text-sm', 'py-2', 'px-4', 'font-semibold');
      var ingredientName = document.createElement('span');
      ingredientName.textContent = "".concat(ingredient.ingredient);
      ingredientName.classList.add('mb-0');
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
    recipeElement.appendChild(recipeLabel);
    recipeElement.appendChild(description);
    recipeElement.appendChild(ingredientLabel);
    recipeElement.appendChild(ingredientsGrid);
    mediaContainer.appendChild(recipeElement);
  });
} // Exemple de définition des fonctions showErrorMessage et hideErrorMessage
// Fonction pour afficher un message d'erreur avec un texte dynamique


function showErrorMessage(searchText) {
  var mediaContainer = document.getElementById('media-container');
  var errorMessageContainer = document.getElementById('error-message');

  if (mediaContainer) {
    mediaContainer.innerHTML = ''; // Efface les médias affichés
  }

  if (errorMessageContainer) {
    errorMessageContainer.style.display = 'block'; // Affiche le message d'erreur

    errorMessageContainer.textContent = 'Aucune recette ne contient "' + searchText + '". Vous pouvez chercher "tarte aux pommes", "poisson", etc.';
  }
} // Fonction pour masquer le message d'erreur


function hideErrorMessage() {
  var errorMessageElement = document.getElementById('error-message');

  if (errorMessageElement) {
    errorMessageElement.style.display = 'none';
  }
} // Fonction pour mettre à jour le compteur de recettes affichées


function updateRecipeCount(count) {
  var recipeCountElement = document.getElementById('total-recipes'); // Assurez-vous que cet ID correspond à l'élément dans votre HTML
  // Formater le compteur avec un préfixe de zéro

  var formattedCount = count.toString().padStart(2, '0'); // Logique pour déterminer le texte

  var recipeText = '';

  if (count === 0) {
    recipeText = 'recette'; // Aucun 's' pour 0
  } else {
    recipeText = count === 1 ? 'recette' : 'recettes'; // Singular ou plural
  } // Mettre à jour l'élément d'affichage


  recipeCountElement.textContent = "".concat(formattedCount, " ").concat(recipeText);
}