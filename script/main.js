import { recipes } from './recipes.js'; // Assurez-vous que le chemin est correct
import { displayRecipes, showErrorMessage, hideErrorMessage } from './index.js'; // Assurez-vous que le chemin est correct

export function rechercheCombinée() {
  const texteRecherche = document.getElementById('search-input').value.toLowerCase();

  const recettesFiltrees = recipes.filter(recette => {
    // Vérification si le texte de recherche correspond à la recette
    const correspondTexte = texteRecherche.length === 0 || 
                            recette.name.toLowerCase().includes(texteRecherche) ||
                            recette.description.toLowerCase().includes(texteRecherche) ||
                            recette.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(texteRecherche));

    // Récupération des filtres sélectionnés
    const ingredientsSelectionnes = Array.from(document.getElementById('ingredients').selectedOptions).map(option => option.value.toLowerCase());
    const appareilsSelectionnes = Array.from(document.getElementById('appareils').selectedOptions).map(option => option.value.toLowerCase());
    const ustensilesSelectionnes = Array.from(document.getElementById('ustensiles').selectedOptions).map(option => option.value.toLowerCase());

    // Vérification des filtres sélectionnés
    const correspondIngredients = ingredientsSelectionnes.length === 0 || recette.ingredients.some(ingredient => ingredientsSelectionnes.includes(ingredient.ingredient.toLowerCase()));
    const correspondAppareils = appareilsSelectionnes.length === 0 || appareilsSelectionnes.includes(recette.appliance?.toLowerCase() || '');
    const correspondUstensiles = ustensilesSelectionnes.length === 0 || recette.ustensils?.some(ustensile => ustensilesSelectionnes.includes(ustensile.toLowerCase())) || false;

    return correspondTexte && correspondIngredients && correspondAppareils && correspondUstensiles;
  });

  // Mise à jour de l'affichage des recettes filtrées
  if (recettesFiltrees.length === 0) {
    showErrorMessage(); // Affiche un message d'erreur si aucune recette ne correspond
  } else {
    hideErrorMessage(); // Cache le message d'erreur s'il est affiché
    displayRecipes(recettesFiltrees); // Utilisation de la fonction `displayRecipes`
  }

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
