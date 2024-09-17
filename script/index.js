//Ce fichier contiendra les fonctions principales pour 
//la gestion des recettes, l'affichage et la mise à jour des tags 
//et filtres.
//Responsable du filtrage combiné, de l'affichage initial 
//des recettes et des événements principaux 
//(tags, barre de recherche, etc.).

import { recipes } from './recipes.js'; // Assure-toi que le chemin est correct


// Fonction pour afficher les recettes
export function displayRecipes(recipes) {
  const mediaContainer = document.getElementById('media-container');

  if (!mediaContainer) {
    console.error('Élément #media-container non trouvé');
    return;
  }

  mediaContainer.innerHTML = ''; // Effacer les recettes existantes

  recipes.forEach(recipe => {
    const recipeElement = document.createElement('div');
    recipeElement.classList.add('recipe-item', 'bg-white', 'shadow-md', 'rounded-lg', 'p-6', 'mb-6', 'w-full', 'max-w-lg', 'mx-auto');

    // Conteneur d'image
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('relative');

    const recipeImage = document.createElement('img');
    recipeImage.src = `dataMedia/${recipe.image}`;
    recipeImage.alt = recipe.name;
    recipeImage.classList.add('w-full', 'h-auto', 'rounded-t-lg', 'object-cover');

    // Badge de temps
    const timeBadge = document.createElement('span');
    timeBadge.textContent = `${recipe.time} min`;
    timeBadge.classList.add('absolute', 'top-3', 'right-3', 'bg-yellow-400', 'text-black', 'rounded-full', 'px-3', 'py-1', 'text-xs', 'font-bold');

    // Titre de la recette
    const recipeTitle = document.createElement('h2');
    recipeTitle.textContent = recipe.name;
    recipeTitle.classList.add('text-xl', 'font-bold', 'mb-2', 'text-gray-900');

    // Description de la recette
    const description = document.createElement('p');
    description.textContent = recipe.description;
    description.classList.add('text-base', 'my-2', 'text-gray-700');

    // Ingrédients
    const ingredientsGrid = document.createElement('div');
    ingredientsGrid.classList.add('grid', 'grid-cols-2', 'gap-4', 'text-gray-700', 'mt-2');

    recipe.ingredients.forEach(ingredient => {
      const ingredientElement = document.createElement('div');
      ingredientElement.classList.add('flex', 'flex-col', 'text-sm', 'font-semibold');

      const ingredientName = document.createElement('span');
      ingredientName.textContent = `${ingredient.ingredient}`;
      ingredientName.classList.add('mb-1');

      const ingredientQuantity = document.createElement('span');
      if (ingredient.quantity) {
        ingredientQuantity.textContent = `${ingredient.quantity} ${ingredient.unit || ''}`.trim();
        ingredientQuantity.classList.add('text-gray-500', 'font-normal');
      }

      ingredientElement.appendChild(ingredientName);
      ingredientElement.appendChild(ingredientQuantity);
      ingredientsGrid.appendChild(ingredientElement);
    });

    // Append à la carte de recette
    imageContainer.appendChild(recipeImage);
    imageContainer.appendChild(timeBadge);
    recipeElement.appendChild(imageContainer);
    recipeElement.appendChild(recipeTitle);
    recipeElement.appendChild(description);
    recipeElement.appendChild(ingredientsGrid);
    mediaContainer.appendChild(recipeElement);
  });
}


// Exemple de définition des fonctions showErrorMessage et hideErrorMessage
// Fonction pour afficher un message d'erreur avec un texte dynamique
export function showErrorMessage(searchText) {
  const errorMessageElement = document.getElementById('error-message');
  if (errorMessageElement) {
    errorMessageElement.textContent = `Aucune recette ne contient "${searchText}". Vous pouvez chercher "tarte aux pommes", "poisson", etc.`;
    errorMessageElement.style.display = 'block';
    console.log('Texte de recherche:', texteRecherche);
  }
}

// Fonction pour masquer le message d'erreur
export function hideErrorMessage() {
  const errorMessageElement = document.getElementById('error-message');
  if (errorMessageElement) {
    errorMessageElement.style.display = 'none';
  }
}
// Fonction pour mettre à jour le compteur de recettes affichées
export function updateRecipeCount(count) {
  const recipeCountElement = document.getElementById('total-recipes');
  if (recipeCountElement) {
    recipeCountElement.textContent = `${count} Recettes`;
  } else {
    console.error('Élément #total-recipes non trouvé');
  }
}