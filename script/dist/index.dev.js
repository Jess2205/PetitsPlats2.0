"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.capitalizeFirstLetter = capitalizeFirstLetter;
exports.displayRecipes = displayRecipes;
exports.showErrorMessage = showErrorMessage;
exports.hideErrorMessage = hideErrorMessage;
exports.updateRecipeCount = updateRecipeCount;

var _recipes = require("./recipes.js");

var _filtres = require("./filtres.js");

var _main = require("./main.js");

//Chargement initial, gestion des événements globaux 
//et appel des fonctions de recherche et de filtre.
// Importation des données de recettes depuis le fichier recipes.js
console.log(_recipes.recipes); // Affiche les recettes dans la console pour vérifier si elles sont bien importées
// Fonction pour capitaliser la première lettre d'une chaîne et passer le reste en minuscules

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
} // Récupère les tags sélectionnés, les formatte avec la première lettre en majuscule, et les trie par ordre alphabétique


var selectedIngredients = _filtres.selectedTags.ingredients.map(function (tag) {
  return capitalizeFirstLetter(tag);
}).sort();

var selectedAppareils = _filtres.selectedTags.appareils.map(function (tag) {
  return capitalizeFirstLetter(tag);
}).sort();

var selectedUstensiles = _filtres.selectedTags.ustensiles.map(function (tag) {
  return capitalizeFirstLetter(tag);
}).sort(); // Fonction pour afficher les recettes


function displayRecipes(recipes) {
  var mediaContainer = document.getElementById('media-container'); // Sélectionne l'élément qui contiendra les recettes

  if (!mediaContainer) {
    console.error('Élément #media-container non trouvé'); // Affiche un message d'erreur si l'élément n'est pas trouvé

    return; // Sort de la fonction si l'élément est introuvable
  }

  mediaContainer.innerHTML = ''; // Efface les recettes existantes avant d'ajouter de nouvelles

  recipes.forEach(function (recipe) {
    // Parcourt chaque recette
    var recipeElement = document.createElement('div'); // Crée un conteneur pour chaque recette

    recipeElement.classList.add('recipe-item', 'bg-white', 'shadow-lg', 'rounded-xl', 'mb-2', 'overflow-hidden', 'h-full'); // Applique les classes Tailwind pour le style
    // Conteneur d'image

    var imageContainer = document.createElement('div'); // Crée un conteneur pour chaque recette

    imageContainer.classList.add('relative', 'w-full', 'h-64', 'rounded-t-xl'); // Style pour l'image

    var recipeImage = document.createElement('img'); // Crée l'élément image pour la recette

    recipeImage.src = "dataMedia/".concat(recipe.image); // Définit la source de l'image à partir du dossier de médias

    recipeImage.alt = recipe.name; // Ajoute un texte alternatif pour l'image (important pour l'accessibilité)

    recipeImage.classList.add('w-full', 'h-full', 'object-cover'); // Applique les styles à l'image
    // Badge de temps

    var timeBadge = document.createElement('span'); // Crée un badge pour le temps

    timeBadge.textContent = "".concat(recipe.time, " min"); // Affiche le temps de préparation

    timeBadge.classList.add('absolute', 'top-5', 'right-6', 'bg-yellow-400', 'text-black', 'rounded-full', 'px-3', 'py-1', 'text-xs', 'font-bold'); // Style du badge
    // Titre de la recette

    var recipeTitle = document.createElement('h2'); // Crée un élément pour le titre

    recipeTitle.textContent = (0, _main.escapeHtml)(capitalizeFirstLetter(recipe.name)); // Affiche le nom de la recette

    recipeTitle.classList.add('text-l', 'font-bold', 'text-gray-900', 'py-6', 'px-6'); // Style du titre
    // Label recette

    var recipeLabel = document.createElement('h3'); // Crée un élément pour le label de recette

    recipeLabel.textContent = (0, _main.escapeHtml)(capitalizeFirstLetter("RECETTE")); // Texte "RECETTE" affiché

    recipeLabel.classList.add('text-sm', 'uppercase', 'font-semibold', 'pb-2', 'px-6', 'text-gray-600'); // Style du label
    // Description de la recette

    var description = document.createElement('p'); // Crée un élément pour la description

    description.textContent = (0, _main.escapeHtml)(recipe.description); // Affiche la description de la recette

    description.classList.add('text-2', 'mb-8', 'px-6', 'text-gray-700', 'leading-tight', 'line-clamp-4', 'h-24', 'overflow-hidden'); // Style de la description
    // Label ingrédients

    var ingredientLabel = document.createElement('h3'); // Crée un élément pour le label des ingrédients

    ingredientLabel.textContent = (0, _main.escapeHtml)(capitalizeFirstLetter("INGREDIENTS")); // Définit le texte du label

    ingredientLabel.classList.add('text-sm', 'mt-4', 'uppercase', 'font-semibold', 'pb-2', 'px-6', 'text-gray-600'); // Applique les styles
    // Grille pour les ingrédients

    var ingredientsGrid = document.createElement('div'); // Crée un conteneur pour les ingrédients

    ingredientsGrid.classList.add('grid', 'pb-12', 'px-6', 'grid-cols-2', 'gap-4', 'text-gray-700'); // Applique les styles de grille
    // Parcours des ingrédients pour les afficher

    recipe.ingredients.forEach(function (ingredient) {
      var ingredientElement = document.createElement('div'); // Crée un conteneur pour chaque ingrédient

      ingredientElement.classList.add('flex', 'flex-col', 'text-sm', 'font-semibold'); // Applique les classes CSS

      var ingredientName = document.createElement('span'); // Crée un élément pour le nom de l'ingrédient

      ingredientName.textContent = (0, _main.escapeHtml)("".concat(capitalizeFirstLetter(ingredient.ingredient))); // Échapper le nom

      ingredientName.classList.add('mb-0'); // Applique les styles

      var ingredientQuantity = document.createElement('span'); // Crée un élément pour la quantité

      if (ingredient.quantity) {
        // Vérifie si une quantité est spécifiée
        ingredientQuantity.textContent = (0, _main.escapeHtml)("".concat(ingredient.quantity, " ").concat(ingredient.unit || '').trim()); // Échapper la quantité

        ingredientQuantity.classList.add('text-gray-900', 'mb-1'); // Applique les styles
      }

      ingredientElement.appendChild(ingredientName); // Ajoute le nom de l'ingrédient au conteneur

      ingredientElement.appendChild(ingredientQuantity); // Ajoute la quantité au conteneur

      ingredientsGrid.appendChild(ingredientElement); // Ajoute le conteneur d'ingrédient à la grille
    }); // Ajoute les éléments créés à la carte de recette

    imageContainer.appendChild(recipeImage); // Ajoute l'image au conteneur d'image

    imageContainer.appendChild(timeBadge); // Ajoute le badge de temps au conteneur d'image

    recipeElement.appendChild(imageContainer); // Ajoute le conteneur d'image à l'élément de recette

    recipeElement.appendChild(recipeTitle); // Ajoute le titre à l'élément de recette

    recipeElement.appendChild(recipeLabel); // Ajoute le label à l'élément de recette

    recipeElement.appendChild(description); // Ajoute la description à l'élément de recette

    recipeElement.appendChild(ingredientLabel); // Ajoute le label des ingrédients à l'élément de recette

    recipeElement.appendChild(ingredientsGrid); // Ajoute la grille d'ingrédients à l'élément de recette

    mediaContainer.appendChild(recipeElement); // Ajoute l'élément de recette au conteneur principal
  });
} // Exemple de définition des fonctions showErrorMessage et hideErrorMessage
// Fonction pour afficher un message d'erreur avec un texte dynamique


function showErrorMessage(searchText) {
  var mediaContainer = document.getElementById('media-container'); // Récupère le conteneur principal des médias

  var errorMessageContainer = document.getElementById('error-message'); // Récupère le conteneur du message d'erreur

  if (mediaContainer) {
    mediaContainer.innerHTML = ''; // Efface les médias affichés en cas d'erreur
  }

  if (errorMessageContainer) {
    errorMessageContainer.style.display = 'block'; // Affiche le message d'erreur

    errorMessageContainer.textContent = 'Aucune recette ne contient "' + (0, _main.escapeHtml)(searchText) + '". Vous pouvez chercher "tarte aux pommes", "poisson", etc.'; // Définit le texte d'erreur
  } else {
    console.error('Élément #error-message non trouvé'); // Affiche un message d'erreur si l'élément n'est pas trouvé
  }
} // Fonction pour masquer le message d'erreur


function hideErrorMessage() {
  var errorMessageElement = document.getElementById('error-message'); // Récupère l'élément de message d'erreur

  if (errorMessageElement) {
    errorMessageElement.style.display = 'none'; // Masque le message d'erreur
  }
} // Fonction pour mettre à jour le compteur de recettes affichées


function updateRecipeCount(count) {
  var recipeCountElement = document.getElementById('total-recipes'); // Récupère l'élément pour afficher le compteur de recettes
  // Formater le compteur avec un préfixe de zéro

  var formattedCount = count.toString().padStart(2, '0'); // Formate le nombre avec des zéros devant
  // Logique pour déterminer le texte en fonction du nombre de recettes

  var recipeText = '';

  if (count === 0) {
    recipeText = 'recette'; // Aucun 's' pour 0
  } else {
    recipeText = count === 1 ? 'recette' : 'recettes'; // Singular ou pluriel selon le nombre
  } // Mettre à jour l'élément d'affichage avec le compteur formaté


  recipeCountElement.textContent = "".concat((0, _main.escapeHtml)(formattedCount), " ").concat((0, _main.escapeHtml)(recipeText)); // Définit le texte du compteur
}