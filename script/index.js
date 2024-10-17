//Chargement initial, gestion des événements globaux 
//et appel des fonctions de recherche et de filtre.

import { recipes } from './recipes.js'; // Importation des données de recettes depuis le fichier recipes.js
import { selectedTags } from './filtres.js';

console.log(recipes);// Affiche les recettes dans la console pour vérifier si elles sont bien importées

// Fonction pour capitaliser la première lettre d'une chaîne et passer le reste en minuscules
export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
// Récupère les tags sélectionnés, les formatte avec la première lettre en majuscule, et les trie par ordre alphabétique
const selectedIngredients = selectedTags.ingredients
  .map(tag => capitalizeFirstLetter(tag))
  .sort();
  const selectedAppareils = selectedTags.appareils
  .map(tag => capitalizeFirstLetter(tag))
  .sort();

const selectedUstensiles = selectedTags.ustensiles
  .map(tag => capitalizeFirstLetter(tag))
  .sort();

// Fonction pour afficher les recettes
export function displayRecipes(recipes) {
  const mediaContainer = document.getElementById('media-container');// Sélectionne l'élément qui contiendra les recettes

  if (!mediaContainer) {
    console.error('Élément #media-container non trouvé');// Affiche un message d'erreur si l'élément n'est pas trouvé
    return;// Sort de la fonction si l'élément est introuvable
  }

  mediaContainer.innerHTML = ''; // Efface les recettes existantes avant d'ajouter de nouvelles

  recipes.forEach(recipe => {// Parcourt chaque recette
    const recipeElement = document.createElement('div');// Crée un conteneur pour chaque recette
    recipeElement.classList.add('recipe-item', 'bg-white', 'shadow-lg', 'rounded-xl', 'mb-2', 'overflow-hidden', 'h-full');// Applique les classes Tailwind pour le style

    // Conteneur d'image
    const imageContainer = document.createElement('div');// Crée un conteneur pour chaque recette
    imageContainer.classList.add('relative', 'w-full', 'h-64', 'rounded-t-xl');// Style pour l'image

    const recipeImage = document.createElement('img');// Crée l'élément image pour la recette
    recipeImage.src = `dataMedia/${recipe.image}`;// Définit la source de l'image à partir du dossier de médias
    recipeImage.alt = recipe.name;// Ajoute un texte alternatif pour l'image (important pour l'accessibilité)
    recipeImage.classList.add('w-full', 'h-full', 'object-cover');// Applique les styles à l'image

    // Badge de temps
    const timeBadge = document.createElement('span');// Crée un badge pour le temps
    timeBadge.textContent = `${recipe.time} min`;// Affiche le temps de préparation
    timeBadge.classList.add('absolute', 'top-5', 'right-6', 'bg-yellow-400', 'text-black', 'rounded-full', 'px-3', 'py-1', 'text-xs', 'font-bold');// Style du badge

    // Titre de la recette
    const recipeTitle = document.createElement('h2');// Crée un élément pour le titre
    recipeTitle.textContent = capitalizeFirstLetter(recipe.name);// Affiche le nom de la recette
    recipeTitle.classList.add('text-l', 'font-bold', 'text-gray-900', 'py-6','px-6');// Style du titre

    // Label recette
    const recipeLabel = document.createElement('h3');// Crée un élément pour le label de recette
    recipeLabel.textContent = capitalizeFirstLetter("RECETTE");// Texte "RECETTE" affiché
    recipeLabel.classList.add('text-sm','uppercase','font-semibold','pb-2','px-6', 'text-gray-600' );// Style du label

    // Description de la recette
    const description = document.createElement('p');// Crée un élément pour la description
    description.textContent = recipe.description;// Affiche la description de la recette
    description.classList.add('text-2','mb-8','px-6', 'text-gray-700','leading-tight', 'line-clamp-4', 'h-24', 'overflow-hidden');// Style de la description

    // Label ingrédients
    const ingredientLabel = document.createElement('h3');// Crée un élément pour le label des ingrédients
    ingredientLabel.textContent = capitalizeFirstLetter("INGREDIENTS");// Définit le texte du label
    ingredientLabel.classList.add('text-sm','mt-4','uppercase','font-semibold','pb-2','px-6','text-gray-600');// Applique les styles

     // Grille pour les ingrédients
    const ingredientsGrid = document.createElement('div'); // Crée un conteneur pour les ingrédients
    ingredientsGrid.classList.add('grid','pb-12','px-6', 'grid-cols-2', 'gap-4', 'text-gray-700');// Applique les styles de grille

     // Parcours des ingrédients pour les afficher
    recipe.ingredients.forEach(ingredient => {
      const ingredientElement = document.createElement('div');// Crée un conteneur pour chaque ingrédient
      ingredientElement.classList.add('flex', 'flex-col', 'text-sm', 'font-semibold');// Applique les classes CSS

      const ingredientName = document.createElement('span');// Crée un élément pour le nom de l'ingrédient
      ingredientName.textContent = `${capitalizeFirstLetter(ingredient.ingredient)}`;// Définit le texte du nom
      ingredientName.classList.add('mb-0');// Applique les styles

      const ingredientQuantity = document.createElement('span');// Crée un élément pour la quantité
      if (ingredient.quantity) {// Vérifie si une quantité est spécifiée
        ingredientQuantity.textContent = `${ingredient.quantity} ${ingredient.unit || ''}`.trim();// Définit le texte de la quantité
        ingredientQuantity.classList.add('text-gray-900', 'mb-1');// Applique les styles
      }

      ingredientElement.appendChild(ingredientName); // Ajoute le nom de l'ingrédient au conteneur
      ingredientElement.appendChild(ingredientQuantity);// Ajoute la quantité au conteneur
      ingredientsGrid.appendChild(ingredientElement);// Ajoute le conteneur d'ingrédient à la grille
    });

    // Ajoute les éléments créés à la carte de recette
    imageContainer.appendChild(recipeImage);// Ajoute l'image au conteneur d'image
    imageContainer.appendChild(timeBadge);// Ajoute le badge de temps au conteneur d'image
    recipeElement.appendChild(imageContainer);// Ajoute le conteneur d'image à l'élément de recette
    recipeElement.appendChild(recipeTitle);// Ajoute le titre à l'élément de recette
    recipeElement.appendChild(recipeLabel);// Ajoute le label à l'élément de recette
    recipeElement.appendChild(description);// Ajoute la description à l'élément de recette
    recipeElement.appendChild(ingredientLabel);// Ajoute le label des ingrédients à l'élément de recette
    recipeElement.appendChild(ingredientsGrid);// Ajoute la grille d'ingrédients à l'élément de recette
    mediaContainer.appendChild(recipeElement);// Ajoute l'élément de recette au conteneur principal
  });
}


// Exemple de définition des fonctions showErrorMessage et hideErrorMessage
// Fonction pour afficher un message d'erreur avec un texte dynamique
export function showErrorMessage(searchText) {
  const mediaContainer = document.getElementById('media-container'); // Récupère le conteneur principal des médias
  const errorMessageContainer = document.getElementById('error-message'); // Récupère le conteneur du message d'erreur

  if (mediaContainer) {
    mediaContainer.innerHTML = ''; // Efface les médias affichés en cas d'erreur
  }

  if (errorMessageContainer) {
    errorMessageContainer.style.display = 'block'; // Affiche le message d'erreur
    errorMessageContainer.textContent = 'Aucune recette ne contient "' + searchText + '". Vous pouvez chercher "tarte aux pommes", "poisson", etc.'; // Définit le texte d'erreur
  } else {
    console.error('Élément #error-message non trouvé'); // Affiche un message d'erreur si l'élément n'est pas trouvé
  }
}

// Fonction pour masquer le message d'erreur
export function hideErrorMessage() {
  const errorMessageElement = document.getElementById('error-message');// Récupère l'élément de message d'erreur
  if (errorMessageElement) {
    errorMessageElement.style.display = 'none';// Masque le message d'erreur
  }
}

// Fonction pour mettre à jour le compteur de recettes affichées
export function updateRecipeCount(count) {
  const recipeCountElement = document.getElementById('total-recipes'); // Récupère l'élément pour afficher le compteur de recettes


  // Formater le compteur avec un préfixe de zéro
  const formattedCount = count.toString().padStart(2, '0');// Formate le nombre avec des zéros devant


   // Logique pour déterminer le texte en fonction du nombre de recettes
  let recipeText = '';
  if (count === 0) {
    recipeText = 'recette'; // Aucun 's' pour 0
  } else {
    recipeText = count === 1 ? 'recette' : 'recettes'; // Singular ou pluriel selon le nombre
  }

  // Mettre à jour l'élément d'affichage avec le compteur formaté
  recipeCountElement.textContent = `${formattedCount} ${recipeText}`;// Définit le texte du compteur
}



