import { recipes } from './recipes.js'; // Assurez-vous que le chemin est correct
import { displayRecipes } from './index.js'; // Assurez-vous que le chemin est correct

export function rechercheCombinée() {
  const texteRecherche = document.getElementById('search-input').value.toLowerCase();

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

  displayRecipes(recettesFiltrees); // Utilisation de la fonction `displayRecipes`

  // Mettre à jour le nombre total de recettes affichées
  const totalRecettesElement = document.getElementById('total-recipes');
  if (totalRecettesElement) {
    totalRecettesElement.textContent = `${recettesFiltrees.length} recettes`;
  }
}

// Ajouter les écouteurs d'événements
window.addEventListener('load', () => {
  displayRecipes(recipes); // Affiche toutes les recettes au chargement de la page
});

const searchInput = document.getElementById('search-input');
if (searchInput) {
  searchInput.addEventListener('input', rechercheCombinée);
}

const filtres = document.querySelectorAll('#ingredients, #appareils, #ustensiles');
filtres.forEach(filtre => {
  if (filtre) {
    filtre.addEventListener('change', rechercheCombinée);
  }
});
