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
      tag.className = 'tag bg-yellow-400 text-black rounded px-3 py-1 mr-2 mb-2 inline-block';
      tag.textContent = tagText;

      const removeIcon = document.createElement('span');
      removeIcon.textContent = '✖';
      removeIcon.classList.add('ml-2', 'cursor-pointer');
      tag.appendChild(removeIcon);

      removeIcon.addEventListener('click', () => {
        removeTag(tagText, category);
        filterRecipesWithAdvancedFilters(); // Refiltre les recettes après suppression du tag
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
  const texteRecherche = document.getElementById('search-input').value.toLowerCase();
  const searchText = searchInput.value.trim().toLowerCase();

  if (searchText.length < 3) {
    return;
  }

  const selectedIngredients = Array.from(document.getElementById('ingredients').selectedOptions).map(option => option.value.toLowerCase());
  const selectedAppareils = Array.from(document.getElementById('appareils').selectedOptions).map(option => option.value.toLowerCase());
  const selectedUstensiles = Array.from(document.getElementById('ustensiles').selectedOptions).map(option => option.value.toLowerCase());

  const recettesFiltrees = recipes.filter(recette => {
    const correspondTexte = recette.name.toLowerCase().includes(searchText) ||
                            recette.description.toLowerCase().includes(searchText) ||
                            recette.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(searchText));

    const correspondIngredients = !selectedIngredients.length || recette.ingredients.some(ingredient => selectedIngredients.includes(ingredient.ingredient.toLowerCase()));
    const correspondAppareils = !selectedAppareils.length || selectedAppareils.includes(recette.appliance?.toLowerCase() || '');
    const correspondUstensiles = !selectedUstensiles.length || recette.ustensils?.some(ustensile => selectedUstensiles.includes(ustensile.toLowerCase())) || false;

    return correspondTexte && correspondIngredients && correspondAppareils && correspondUstensiles;
  });

  // Mise à jour du compteur de recettes
  document.getElementById('total-recipes').textContent = `${recettesFiltrees.length} recettes`;

  if (recettesFiltrees.length === 0) {
    showErrorMessage(searchText); // Appelle la fonction pour afficher le message d'erreur et vider les médias
  } else {
    hideErrorMessage();
    displayRecipes(recettesFiltrees); // Affiche les recettes filtrées
    updateAdvancedFilters(recettesFiltrees); // Met à jour les filtres avancés
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
