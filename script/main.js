//Contient la logique de recherche principale et
//la mise à jour de l'affichage.

import { recipes } from './recipes.js'; // Importation des données des recettes
import { displayRecipes, showErrorMessage, hideErrorMessage } from './index.js'; // Importation des fonctions pour afficher les recettes et gérer les messages d'erreur
import { selectedTags, filterOptions, updateAdvancedFilters } from './filtres.js';// Importation de la fonction qui affiche les tags
import { updateRecipeCount} from './index.js';


// Fonction pour masquer les recettes en vidant le conteneur
function hideRecipes() {
  const recipeContainer = document.getElementById('results-container');
  if (recipeContainer) {
    recipeContainer.innerHTML = ''; // Efface les recettes affichées
  }
}

// Fonction de filtrage principale avec méthodes fonctionnelles
// Fonction principale de filtrage des recettes
export function MainfilterRecipes() { 
  // Masque les recettes précédemment affichées
  hideRecipes(); // Appel de la fonction pour vider le conteneur des recettes

  const MainsearchInput = document.getElementById('main-search-input');
  const MainsearchText = MainsearchInput.value.trim().toLowerCase();// Récupère la valeur du champ de recherche principal

  // Récupération des valeurs des champs de recherche avancés (ingrédients, appareils, ustensiles)
  const ingredientInput = document.getElementById('ingredients-search').value.trim().toLowerCase();
  const appareilInput = document.getElementById('appareils-search').value.trim().toLowerCase();
  const ustensileInput = document.getElementById('ustensiles-search').value.trim().toLowerCase();

  // Vérifiez si le champ de recherche principal et tous les champs de recherche des filtres sont vides
  const isAllEmpty = MainsearchText === '' && ingredientInput === '' && appareilInput === '' && ustensileInput === '' &&
    selectedTags.ingredients.length === 0 &&
    selectedTags.appareils.length === 0 &&
    selectedTags.ustensiles.length === 0;

  let filteredRecipes;

  // Si moins de 3 caractères, afficher toutes les recettes ou celles filtrées par tags
  if (MainsearchText.length < 3) {
    if (selectedTags.ingredients.length > 0 || selectedTags.appareils.length > 0 || selectedTags.ustensiles.length > 0) {
      // Filtrer selon les tags si présents
      filteredRecipes = recipes.filter(recette => {
        const matchesTags =
          selectedTags.ingredients.every(tag => 
            recette.ingredients.some(ingredient => ingredient.ingredient.toLowerCase() === tag.toLowerCase())
          ) && 
          selectedTags.appareils.every(tag => 
            recette.appliance?.toLowerCase() === tag.toLowerCase()
          ) && 
          selectedTags.ustensiles.every(tag => 
            recette.ustensils?.some(ustensile => ustensile.toLowerCase() === tag.toLowerCase())
          );

        return matchesTags;
      });
    } else {
      filteredRecipes = recipes; // Affiche toutes les recettes si aucun tag
    }
  } else {
    // Filtrer les recettes en fonction de la recherche principale et des filtres avancés
    filteredRecipes = recipes.filter(recette => {
      const correspondTexte = MainsearchText === '' || 
        recette.name.toLowerCase().includes(MainsearchText) ||  
        recette.description.toLowerCase().includes(MainsearchText) ||  
        recette.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(MainsearchText));

      const correspondIngredientInput = ingredientInput === '' || 
        recette.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(ingredientInput));

      const correspondAppareilInput = appareilInput === '' || 
        recette.appliance?.toLowerCase().includes(appareilInput);

      const correspondUstensileInput = ustensileInput === '' || 
        recette.ustensils?.some(ustensile => ustensile.toLowerCase().includes(ustensileInput));

      const matchesTags = 
        selectedTags.ingredients.every(tag => 
          recette.ingredients.some(ingredient => ingredient.ingredient.toLowerCase() === tag.toLowerCase())
        ) && 
        selectedTags.appareils.every(tag => 
          recette.appliance?.toLowerCase() === tag.toLowerCase()
        ) && 
        selectedTags.ustensiles.every(tag => 
          recette.ustensils?.some(ustensile => ustensile.toLowerCase() === tag.toLowerCase())
        );

      return (correspondTexte || isAllEmpty) && correspondIngredientInput && correspondAppareilInput && correspondUstensileInput && matchesTags;
    });
  }

  // Mise à jour l'affichage des recettes filtrées
  displayRecipes(filteredRecipes);

  // Mise à jour du compteur : si tout est vide (texte et tags), affiche 1500, sinon le nombre réel de recettes filtrées
  let totalRecipesCount;
  if (filteredRecipes.length === 50) {
    totalRecipesCount = 1500; // Si le total est à 50, affiche 1500
  } else {
    totalRecipesCount = isAllEmpty ? 1500 : filteredRecipes.length;
  }

  updateRecipeCount(totalRecipesCount);// Met à jour le compteur de recettes affichées
  updateAdvancedFilters(filteredRecipes);// Met à jour les options des filtres selon les recettes filtrées

  // Affiche un message d'erreur si aucune recette n'est trouvée
  if (filteredRecipes.length === 0) {
    showErrorMessage(MainsearchText);
  } else {
    hideErrorMessage();
  } 
}


// Écouteur pour l'événement 'input'
document.getElementById('main-search-input').addEventListener('input', function () {
  handleInputChange(this); // Passe l'élément d'entrée en tant que paramètre
});

// Fonction pour gérer les changements dans le champ de recherche
function handleInputChange(inputElement) {
  const clearBtn = document.getElementById('main-clear-search');
  
  // Vérifiez si le champ de recherche a du texte
  if (inputElement.value.length > 0) {
    clearBtn.classList.remove('hidden'); // Affiche la croix si du texte est saisi
    hideErrorMessage();
  } else {
    clearBtn.classList.add('hidden'); // Masque la croix si l'input est vide
  }

  // Appelez filterOptions pour filtrer les options selon le texte de l'input
  filterOptions('main-search-input', 'ingredients'); // Remplacez 'ingredients' par 'appareils' ou 'ustensiles' selon le cas
}

// Gestion du bouton "clear" pour effacer le texte de la barre de recherche
document.getElementById('main-clear-search').addEventListener('click', function () {
  handleClearSearch(this); // Passe le bouton de nettoyage en tant que paramètre
});

// Fonction pour gérer le nettoyage du champ de recherche
function handleClearSearch(clearBtn) {
  const mainSearchInput = document.getElementById('main-search-input');
  mainSearchInput.value = ''; // Efface le texte de l'input
  clearBtn.classList.add('hidden'); // Masque la croix après avoir effacé le texte
  hideErrorMessage();
  mainSearchInput.focus(); // Remet le focus sur l'input après avoir effacé
  MainfilterRecipes(); // Met à jour les résultats
}

// Initialisation des éléments et des filtres au chargement de la page
window.addEventListener('load', () => {
  displayRecipes(recipes); // Affiche toutes les recettes au départ
  updateAdvancedFilters(recipes); // Met à jour les filtres avec toutes les recettes
 
  // Ajoute l'écouteur d'événement pour la barre de recherche principale
  document.getElementById('main-search-input').addEventListener('input', MainfilterRecipes);

  // Ajoute des écouteurs pour filtrer les options dans les filtres avancés
  document.getElementById('ingredients-search').addEventListener('input', () => filterOptions('ingredients-search', 'ingredients'));
  document.getElementById('appareils-search').addEventListener('input', () => filterOptions('appareils-search', 'appareils'));
  document.getElementById('ustensiles-search').addEventListener('input', () => filterOptions('ustensiles-search', 'ustensiles'));
  });
  
