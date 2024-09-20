import { recipes } from './recipes.js'; // Assurez-vous que le chemin est correct
import { displayRecipes, showErrorMessage, hideErrorMessage, updateRecipeCount } from './index.js'; // Assurez-vous que le chemin est correct

// Objet pour stocker les tags sélectionnés
const selectedTags = {
  ingredients: [],
  appareils: [],
  ustensiles: []
};

// Fonction pour afficher les tags dans le conteneur
function displayTags() {
  const tagContainer = document.getElementById('tag-container');
  if (!tagContainer) {
    console.error('Élément #tag-container non trouvé');
    return;
  }

  tagContainer.innerHTML = ''; // Efface les tags existants

  for (const [category, tagsArray] of Object.entries(selectedTags)) {
    tagsArray.forEach(tagText => {
      const tag = document.createElement('div');
      tag.className = 'bg-yellow-400 text-black rounded px-3 py-1 mr-2 mb-2 inline-flex items-center'; // Ajout de items-center pour centrer le texte et l'icône

      tag.textContent = tagText;

      const removeIcon = document.createElement('span');
      removeIcon.textContent = '✖';
      removeIcon.classList.add('ml-2', 'cursor-pointer', 'hover:text-red-600'); // Ajout d'une couleur au survol

      tag.appendChild(removeIcon);

      removeIcon.addEventListener('click', () => {
        removeTag(tagText, category);
        filterRecipesWithAdvancedFilters(); // Refiltre les recettes après suppression du tag
        displayTags(); // Met à jour l'affichage des tags après la suppression
      });

      tagContainer.appendChild(tag);
    });
  }
}

// Fonction pour ajouter un tag dans la catégorie correspondante
function addTag(tagText, category) {
  if (selectedTags[category] && !selectedTags[category].includes(tagText)) {
    selectedTags[category].push(tagText);
    displayTags(); // Affiche les tags sélectionnés
    filterRecipesWithAdvancedFilters(); // Met à jour les recettes avec les filtres avancés
  }
}


// Fonction pour retirer un tag
function removeTag(tagText, category) {
  if (selectedTags[category]) {
    const index = selectedTags[category].indexOf(tagText);
    if (index > -1) {
      selectedTags[category].splice(index, 1);
      displayTags(); // Re-affiche les tags
    }
  }
}

// Mettre à jour les options des filtres avancés en fonction des recettes affichées
function updateFilterOptions(filteredRecipes) {
  const ingredientsSelect = document.getElementById('ingredients');
  const appareilsSelect = document.getElementById('appareils');
  const ustensilesSelect = document.getElementById('ustensiles');

  if (!ingredientsSelect || !appareilsSelect || !ustensilesSelect) {
    console.error('Un ou plusieurs éléments de filtre non trouvés');
    return;
  }

  const uniqueIngredients = new Set();
  const uniqueAppareils = new Set();
  const uniqueUstensiles = new Set();

  filteredRecipes.forEach(recipe => {
    recipe.ingredients.forEach(ingredient => uniqueIngredients.add(ingredient.ingredient));
    if (recipe.appliance) uniqueAppareils.add(recipe.appliance);
    recipe.ustensils.forEach(ustensile => uniqueUstensiles.add(ustensile));
  });

  const updateOptions = (selectElement, items) => {
    selectElement.innerHTML = '<option value="">Tous</option>';
    items.forEach(item => {
      const option = document.createElement('option');
      option.value = item;
      option.textContent = item;
      selectElement.appendChild(option);
    });
  };

  updateOptions(ingredientsSelect, [...uniqueIngredients]);
  updateOptions(appareilsSelect, [...uniqueAppareils]);
  updateOptions(ustensilesSelect, [...uniqueUstensiles]);
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

  updateRecipeCount(filteredRecipes.length); // Met à jour le compteur de recettes

  if (filteredRecipes.length === 0) {
    hideRecipes(); // Cacher les recettes si aucune recette ne correspond
    showErrorMessage(searchText); // Passer searchText à la fonction d'erreur
  } else {
    hideErrorMessage();
    displayRecipes(filteredRecipes); // Utilise displayRecipes pour afficher les recettes filtrées
    updateFilterOptions(filteredRecipes); // Met à jour les options des filtres avancés avec les recettes filtrées
  }
}

// Fonction de filtrage des recettes
function filterRecipes() {
  const searchInput = document.getElementById('search-input');
  const searchText = searchInput.value.trim().toLowerCase();

  // Récupérer les tags d'ingrédients, d'ustensiles, et d'appareils sélectionnés
  const selectedIngredients = [...document.querySelectorAll('#ingredients option:checked')].map(el => el.value.toLowerCase());
  const selectedUstensils = [...document.querySelectorAll('#ustensiles option:checked')].map(el => el.value.toLowerCase());
  const selectedAppliances = [...document.querySelectorAll('#appareils option:checked')].map(el => el.value.toLowerCase());

  // Filtrer les recettes selon le texte et les tags
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearchText = (
      recipe.name.toLowerCase().includes(searchText) ||
      recipe.description.toLowerCase().includes(searchText) ||
      recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchText))
    );

    // Vérifier que la recette contient tous les ingrédients sélectionnés
    const matchesIngredients = selectedIngredients.every(tag => 
      recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(tag))
    );

    // Vérifier que la recette contient tous les ustensiles sélectionnés
    const matchesUstensils = selectedUstensils.every(tag => 
      recipe.ustensils.some(ustensil => ustensil.toLowerCase().includes(tag))
    );

    // Vérifier que la recette utilise l'appareil sélectionné
    const matchesAppliance = selectedAppliances.length === 0 || selectedAppliances.includes(recipe.appliance.toLowerCase());

    // Retourner vrai seulement si tous les critères sont remplis (intersection des résultats)
    return matchesSearchText && matchesIngredients && matchesUstensils && matchesAppliance;
  });

  // Afficher ou masquer les résultats en fonction des recettes filtrées
  if (filteredRecipes.length === 0) {
    showErrorMessage(searchText);
  } else {
    hideErrorMessage();
    displayRecipes(filteredRecipes);
  }
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

// Initialisation des filtres lors du chargement de la page
window.addEventListener('load', () => {
  updateFilterOptions(recipes); // Met à jour les options des filtres avancés avec toutes les recettes initiales
  listenToFilterChanges();
});
