import { recipes } from './recipes.js'; // Assurez-vous que le chemin est correct
import { displayRecipes, showErrorMessage, hideErrorMessage } from './index.js'; // Assurez-vous que le chemin est correct

// Fonction pour mettre à jour les options des filtres avancés
function updateAdvancedFilters(recipes) {
  const filters = {
    ingredients: new Set(),
    appareils: new Set(),
    ustensiles: new Set()
  };

  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];

    // Parcours des ingrédients
    for (let j = 0; j < recipe.ingredients.length; j++) {
      const ingredient = recipe.ingredients[j].ingredient;
      filters.ingredients.add(ingredient);
    }

    // Ajout de l'appareil
    if (recipe.appliance) {
      filters.appareils.add(recipe.appliance);
    }

    // Parcours des ustensiles
    for (let k = 0; k < recipe.ustensils.length; k++) {
      const ustensile = recipe.ustensils[k];
      filters.ustensiles.add(ustensile);
    }
  }

  const updateOptions = (selectElement, items) => {
    selectElement.innerHTML = '<option value="">Tous</option>';
    for (let item of items) {
      const option = document.createElement('option');
      option.value = item;
      option.textContent = item;
      selectElement.appendChild(option);
    }
  };

  updateOptions(document.getElementById('ingredients'), [...filters.ingredients]);
  updateOptions(document.getElementById('appareils'), [...filters.appareils]);
  updateOptions(document.getElementById('ustensiles'), [...filters.ustensiles]);
}

// Fonction de filtrage des options dans les filtres avancés
function filterOptions(searchInputId, selectElementId) {
  const searchText = document.getElementById(searchInputId).value.toLowerCase();
  const selectElement = document.getElementById(selectElementId);
  
  Array.from(selectElement.options).forEach(option => {
    option.style.display = option.value.toLowerCase().includes(searchText) || option.value === "" ? "block" : "none";
  });
}

// Fonction de filtrage des recettes
function filterRecipes() {
  const searchInput = document.getElementById('search-input');
  const searchText = searchInput.value.trim().toLowerCase();
  
  console.log('Search Text:', searchText); // Vérifie ce qui est saisi

  if (searchText.length < 3) {
    return;
  }

  const ingredientsSelect = document.getElementById('ingredients');
  const appareilsSelect = document.getElementById('appareils');
  const ustensilesSelect = document.getElementById('ustensiles');
  
  const selectedIngredients = [];
  const selectedAppareils = [];
  const selectedUstensiles = [];

  // Collecte des ingrédients sélectionnés
  for (let i = 0; i < ingredientsSelect.options.length; i++) {
    const option = ingredientsSelect.options[i];
    if (option.selected) {
      selectedIngredients.push(option.value.toLowerCase());
    }
  }

  // Collecte des appareils sélectionnés
  for (let i = 0; i < appareilsSelect.options.length; i++) {
    const option = appareilsSelect.options[i];
    if (option.selected) {
      selectedAppareils.push(option.value.toLowerCase());
    }
  }

  // Collecte des ustensiles sélectionnés
  for (let i = 0; i < ustensilesSelect.options.length; i++) {
    const option = ustensilesSelect.options[i];
    if (option.selected) {
      selectedUstensiles.push(option.value.toLowerCase());
    }
  }

  const recettesFiltrees = [];

  // Filtrage des recettes
  for (let i = 0; i < recipes.length; i++) {
    const recette = recipes[i];
    
    const correspondTexte = recette.name.toLowerCase().includes(searchText) ||
                            recette.description.toLowerCase().includes(searchText) ||
                            recette.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(searchText));

    const correspondIngredients = !selectedIngredients.length || recette.ingredients.some(ingredient => selectedIngredients.includes(ingredient.ingredient.toLowerCase()));
    const correspondAppareils = !selectedAppareils.length || selectedAppareils.includes(recette.appliance?.toLowerCase() || '');
    const correspondUstensiles = !selectedUstensiles.length || recette.ustensils?.some(ustensile => selectedUstensiles.includes(ustensile.toLowerCase())) || false;

    if (correspondTexte && correspondIngredients && correspondAppareils && correspondUstensiles) {
      recettesFiltrees.push(recette);
    }
  }

  // Mise à jour du compteur de recettes
  document.getElementById('total-recipes').textContent = `${recettesFiltrees.length} recettes`;

  if (recettesFiltrees.length === 0) {
    showErrorMessage(searchText);
  } else {
    hideErrorMessage();
    displayRecipes(recettesFiltrees);
    updateAdvancedFilters(recettesFiltrees); // Met à jour les filtres avancés
  }
}

// Ajouter les écouteurs d'événements
window.addEventListener('load', () => {
  displayRecipes(recipes); // Affiche toutes les recettes au chargement de la page
  updateAdvancedFilters(recipes); // Met à jour les filtres avancés avec toutes les recettes

  // Ajoute l'écouteur d'événement pour le champ de recherche
document.getElementById('search-input').addEventListener('input', filterRecipes);

  // Écouteurs pour les champs de recherche des filtres avancés
  document.getElementById('ingredients-search').addEventListener('input', () => filterOptions('ingredients-search', 'ingredients'));
  document.getElementById('appareils-search').addEventListener('input', () => filterOptions('appareils-search', 'appareils'));
  document.getElementById('ustensiles-search').addEventListener('input', () => filterOptions('ustensiles-search', 'ustensiles'));

  // Écouteurs pour les changements dans les filtres
  function listenToFilterChanges() {
    const filtres = document.querySelectorAll('#ingredients, #appareils, #ustensiles');
  
    for (let i = 0; i < filtres.length; i++) {
      const filtre = filtres[i];
      filtre.addEventListener('change', filterRecipes);
    }
  }
  
});
