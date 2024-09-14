import { displayRecipes as afficherRecettes } from './index.js'; // Assurez-vous que le chemin est correct
import { recipes } from './recipes.js'; // Assurez-vous que le chemin est correct
import { hideErrorMessage, showErrorMessage } from './index.js'; // Assurez-vous que le chemin est correct


// Object pour stocker les tags sélectionnés
const selectedTags = {
  ingredients: [],
  appareils: [],
  ustensiles: []
};

// Fonction pour afficher les tags dans le conteneur
function displayTags(selectedTags, category) {
  const tagContainer = document.getElementById('tag-container');
  tagContainer.innerHTML = ''; // Efface les tags existants

  // Vérification que la catégorie existe et que c'est un tableau
  if (!selectedTags || !Array.isArray(selectedTags)) {
    console.error(`selectedTags for category "${category}" is not a valid array.`);
    return;  // Arrêter l'exécution si le tableau n'est pas valide
  }

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

    const matchesAppareils = selectedAppareils.length === 0 ||
      selectedAppareils.includes(recipe.appliance?.toLowerCase() || '');

    const matchesUstensiles = selectedUstensiles.length === 0 ||
      recipe.ustensils?.some(ustensile => 
        selectedUstensiles.includes(ustensile.toLowerCase())
      ) || false;

    return matchesIngredients && matchesAppareils && matchesUstensiles;
  });

  if (filteredRecipes.length === 0) {
    showErrorMessage();
  } else {
    hideErrorMessage();
    afficherRecettes(filteredRecipes); // Utilise afficherRecettes au lieu de displayRecipes
  }
}

// Mettre à jour les options des filtres avancés
function updateFilterOptions() {
  const ingredientsSelect = document.getElementById('ingredients');
  const appareilsSelect = document.getElementById('appareils');
  const ustensilesSelect = document.getElementById('ustensiles');

  const uniqueIngredients = new Set();
  const uniqueAppareils = new Set();
  const uniqueUstensiles = new Set();

  recipes.forEach(recipe => {
    recipe.ingredients.forEach(ingredient => uniqueIngredients.add(ingredient.ingredient));
    if (recipe.appliance) uniqueAppareils.add(recipe.appliance);
    recipe.ustensils.forEach(ustensile => uniqueUstensiles.add(ustensile));
  });

  ingredientsSelect.innerHTML = '<option value="">Ingrédients</option>';
  appareilsSelect.innerHTML = '<option value="">Appareils</option>';
  ustensilesSelect.innerHTML = '<option value="">Ustensiles</option>';

  uniqueIngredients.forEach(ingredient => {
    const option = document.createElement('option');
    option.value = ingredient;
    option.textContent = ingredient;
    ingredientsSelect.appendChild(option);
  });

  uniqueAppareils.forEach(appareil => {
    const option = document.createElement('option');
    option.value = appareil;
    option.textContent = appareil;
    appareilsSelect.appendChild(option);
  });

  uniqueUstensiles.forEach(ustensile => {
    const option = document.createElement('option');
    option.value = ustensile;
    option.textContent = ustensile;
    ustensilesSelect.appendChild(option);
  });
}

// Ajouter des écouteurs d'événements pour les filtres
function listenToFilterChanges() {
  const filters = document.querySelectorAll('#ingredients, #appareils, #ustensiles');
  filters.forEach(filter => {
    if (filter) {
      filter.addEventListener('change', event => {
        const category = event.target.id;
        const selectedOption = event.target.value;
        if (selectedOption) {
          addTag(selectedOption, category);
        }
      });
    }
  });
}

// Ajouter des écouteurs d'événements pour les filtres
window.addEventListener('load', () => {
  updateFilterOptions();
  listenToFilterChanges();
});
