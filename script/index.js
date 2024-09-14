import { recipes } from './recipes.js'; // Assure-toi que le chemin est correct
import { rechercheCombinée } from './main.js';

// Utilisation de la fonction
document.getElementById('search-input').addEventListener('input', rechercheCombinée);

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

// Fonction pour afficher les tags dans le conteneur
function displayTags(selectedTags, category) {
  const tagContainer = document.getElementById('tag-container');
  tagContainer.innerHTML = ''; // Efface les tags existants

  selectedTags.forEach(tagText => {
    const tag = document.createElement('div');
    tag.className = 'tag bg-yellow-400 text-black rounded px-3 py-1 mr-2 mb-2 inline-block';
    tag.textContent = tagText;

    // Gestion de la suppression des tags
    const removeIcon = document.createElement('span');
    removeIcon.textContent = '✖';
    removeIcon.classList.add('ml-2', 'cursor-pointer');
    tag.appendChild(removeIcon);

    removeIcon.addEventListener('click', () => {
      removeTag(tagText, category);
      tagContainer.removeChild(tag);
      filterRecipesWithAdvancedFilters();
    });

    tagContainer.appendChild(tag);
  });
}

// Fonction pour ajouter un tag dans la catégorie correspondante
function addTag(tagText, category) {
  if (!selectedTags[category].includes(tagText)) {
    selectedTags[category].push(tagText);
    displayTags(selectedTags[category], category);
  }
}

// Fonction pour retirer un tag
function removeTag(tagText, category) {
  const index = selectedTags[category].indexOf(tagText);
  if (index > -1) {
    selectedTags[category].splice(index, 1);
  }
}

// Object pour stocker les tags sélectionnés
const selectedTags = {
  ingredients: [],
  appareils: [],
  ustensiles: []
};

// Filtrage des recettes avec les filtres avancés (Ingrédients, Appareils, Ustensiles)
function filterRecipesWithAdvancedFilters() {
  const selectedIngredients = selectedTags.ingredients.map(tag => tag.toLowerCase());
  const selectedAppareils = selectedTags.appareils.map(tag => tag.toLowerCase());
  const selectedUstensiles = selectedTags.ustensiles.map(tag => tag.toLowerCase());

  const filteredRecipes = recipes.filter(recipe => {
    const matchesIngredients = selectedIngredients.length === 0 ||
      recipe.ingredients.some(ingredient => 
        selectedIngredients.includes(ingredient.ingredient.toLowerCase())
      );

    const matchesAppareils = activeFilters.appareils.length === 0 ||
      activeFilters.appareils.includes(recipe.appliance?.toLowerCase() || '');

    const matchesUstensiles = activeFilters.ustensiles.length === 0 ||
      recipe.ustensils?.some(ustensile => 
        activeFilters.ustensiles.includes(ustensile.toLowerCase())
      ) || false;

    return matchesIngredients && matchesAppareils && matchesUstensiles;
  });

  if (filteredRecipes.length === 0) {
    showErrorMessage();
  } else {
    hideErrorMessage();
    displayRecipes(filteredRecipes);
  }
}
