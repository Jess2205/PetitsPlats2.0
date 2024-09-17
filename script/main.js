import { recipes } from './recipes.js'; // Assurez-vous que le chemin est correct
import { displayRecipes, showErrorMessage, hideErrorMessage } from './index.js'; // Assurez-vous que le chemin est correct

// Fonction pour mettre à jour les options des filtres avancés
function updateAdvancedFilters(recipes) {
  const filters = {
    ingredients: new Set(),
    appareils: new Set(),
    ustensiles: new Set()
  };

  recipes.forEach(recipe => {
    recipe.ingredients.forEach(ingredient => filters.ingredients.add(ingredient.ingredient));
    if (recipe.appliance) filters.appareils.add(recipe.appliance);
    recipe.ustensils.forEach(ustensile => filters.ustensiles.add(ustensile));
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
  const texteRecherche = document.getElementById('search-input').value.toLowerCase();

  if (texteRecherche.length < 3) {
    return;
  }

  const selectedIngredients = Array.from(document.getElementById('ingredients').selectedOptions).map(option => option.value.toLowerCase());
  const selectedAppareils = Array.from(document.getElementById('appareils').selectedOptions).map(option => option.value.toLowerCase());
  const selectedUstensiles = Array.from(document.getElementById('ustensiles').selectedOptions).map(option => option.value.toLowerCase());

  const recettesFiltrees = recipes.filter(recette => {
    const correspondTexte = recette.name.toLowerCase().includes(texteRecherche) ||
                            recette.description.toLowerCase().includes(texteRecherche) ||
                            recette.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(texteRecherche));

    const correspondIngredients = !selectedIngredients.length || recette.ingredients.some(ingredient => selectedIngredients.includes(ingredient.ingredient.toLowerCase()));
    const correspondAppareils = !selectedAppareils.length || selectedAppareils.includes(recette.appliance?.toLowerCase() || '');
    const correspondUstensiles = !selectedUstensiles.length || recette.ustensils?.some(ustensile => selectedUstensiles.includes(ustensile.toLowerCase())) || false;

    return correspondTexte && correspondIngredients && correspondAppareils && correspondUstensiles;
  });

  // Mise à jour du compteur de recettes
  document.getElementById('total-recipes').textContent = `${recettesFiltrees.length} recettes`;

  if (recettesFiltrees.length === 0) {
    showErrorMessage();
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

  document.getElementById('search-input').addEventListener('input', filterRecipes);

  // Écouteurs pour les champs de recherche des filtres avancés
  document.getElementById('ingredients-search').addEventListener('input', () => filterOptions('ingredients-search', 'ingredients'));
  document.getElementById('appareils-search').addEventListener('input', () => filterOptions('appareils-search', 'appareils'));
  document.getElementById('ustensiles-search').addEventListener('input', () => filterOptions('ustensiles-search', 'ustensiles'));

  // Écouteurs pour les changements dans les filtres
  const filtres = document.querySelectorAll('#ingredients, #appareils, #ustensiles');
  filtres.forEach(filtre => {
    filtre.addEventListener('change', filterRecipes);
  });
});
