import { recipes } from './recipes.js'; // Assurez-vous que le chemin est correct
import { displayRecipes, showErrorMessage, hideErrorMessage } from './index.js'; // Assurez-vous que le chemin est correct

// Fonction pour mettre à jour les options des filtres avancés
function updateAdvancedFilters(recipes) {
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

// Fonction de filtrage des options dans les filtres avancés
function filterOptions(searchInputId, selectElementId) {
  const searchText = document.getElementById(searchInputId).value.toLowerCase();
  const selectElement = document.getElementById(selectElementId);
  const allOptions = Array.from(selectElement.options);

  allOptions.forEach(option => {
    if (option.value.toLowerCase().includes(searchText) || option.value === "") {
      option.style.display = "block";
    } else {
      option.style.display = "none";
    }
  });
}

// Fonction de recherche combinée
export function rechercheCombinée() {
  const texteRecherche = document.getElementById('search-input').value.toLowerCase();

  if (texteRecherche.length < 3) {
    return;
  }

  const recettesFiltrees = recipes.filter(recette => {
    const correspondTexte = texteRecherche.length === 0 || 
                            recette.name.toLowerCase().includes(texteRecherche) ||
                            recette.description.toLowerCase().includes(texteRecherche) ||
                            recette.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(texteRecherche));

    const ingredientsSelectionnes = Array.from(document.getElementById('ingredients').selectedOptions).map(option => option.value.toLowerCase());
    const appareilsSelectionnes = Array.from(document.getElementById('appareils').selectedOptions).map(option => option.value.toLowerCase());
    const ustensilesSelectionnes = Array.from(document.getElementById('ustensiles').selectedOptions).map(option => option.value.toLowerCase());

    const correspondIngredients = ingredientsSelectionnes.length === 0 || recette.ingredients.some(ingredient => ingredientsSelectionnes.includes(ingredient.ingredient.toLowerCase()));
    const correspondAppareils = appareilsSelectionnes.length === 0 || appareilsSelectionnes.includes(recette.appliance?.toLowerCase() || '');
    const correspondUstensiles = ustensilesSelectionnes.length === 0 || recette.ustensils?.some(ustensile => ustensilesSelectionnes.includes(ustensile.toLowerCase())) || false;

    return correspondTexte && correspondIngredients && correspondAppareils && correspondUstensiles;
  });

 
  // Met à jour le compteur
  const totalRecettesElement = document.getElementById('total-recipes');
  if (totalRecettesElement) {
    totalRecettesElement.textContent = `${recettesFiltrees.length} recettes`;
  }

  if (recettesFiltrees.length === 0) {
    showErrorMessage();
  } else {
    hideErrorMessage();
    displayRecipes(recettesFiltrees);
    updateAdvancedFilters(recettesFiltrees); // Met à jour les filtres avancés
  }
}

 // Fonction pour mettre à jour le compteur de recettes affichées
function updateRecipeCount(count) {
  const recipeCountElement = document.getElementById('total-recipes');
  if (recipeCountElement) {
    recipeCountElement.textContent = `Nombre de recettes affichées : ${count}`;
  } else {
    console.error('Élément #recipe-count non trouvé');
  }
}

// Ajouter les écouteurs d'événements
window.addEventListener('load', () => {
  displayRecipes(recipes); // Affiche toutes les recettes au chargement de la page
  updateAdvancedFilters(recipes); // Met à jour les filtres avancés avec toutes les recettes

  document.getElementById('search-input').addEventListener('input', rechercheCombinée);

  // Écouteurs pour les champs de recherche des filtres avancés
  document.getElementById('ingredients-search').addEventListener('input', () => filterOptions('ingredients-search', 'ingredients'));
  document.getElementById('appareils-search').addEventListener('input', () => filterOptions('appareils-search', 'appareils'));
  document.getElementById('ustensiles-search').addEventListener('input', () => filterOptions('ustensiles-search', 'ustensiles'));

  // Écouteurs pour les changements dans les filtres
  const filtres = document.querySelectorAll('#ingredients, #appareils, #ustensiles');
  filtres.forEach(filtre => {
    if (filtre) {
      filtre.addEventListener('change', rechercheCombinée);
    }
  });
});
