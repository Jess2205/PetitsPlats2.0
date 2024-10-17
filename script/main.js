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

// Fonction principale de filtrage des recettes
export function MainfilterRecipes() { 
  hideRecipes(); // Vide le conteneur des recettes

  const MainsearchInput = document.getElementById('main-search-input');
  const MainsearchText = MainsearchInput.value.trim().toLowerCase();

  const ingredientInput = document.getElementById('ingredients-search').value.trim().toLowerCase();
  const appareilInput = document.getElementById('appareils-search').value.trim().toLowerCase();
  const ustensileInput = document.getElementById('ustensiles-search').value.trim().toLowerCase();

  const isAllEmpty = MainsearchText === '' && ingredientInput === '' && appareilInput === '' && ustensileInput === '' &&
    selectedTags.ingredients.length === 0 &&
    selectedTags.appareils.length === 0 &&
    selectedTags.ustensiles.length === 0;

  let filteredRecipes = [];

  if (MainsearchText.length < 3) {
    if (selectedTags.ingredients.length > 0 || selectedTags.appareils.length > 0 || selectedTags.ustensiles.length > 0) {
      // Filtrer selon les tags
      let i = 0;
      while (i < recipes.length) {
        let recette = recipes[i];
        let matchesTags = true;

        for (let j = 0; j < selectedTags.ingredients.length; j++) {
          let foundIngredient = false;
          for (let k = 0; k < recette.ingredients.length; k++) {
            if (recette.ingredients[k].ingredient.toLowerCase() === selectedTags.ingredients[j].toLowerCase()) {
              foundIngredient = true;
              break;
            }
          }
          if (!foundIngredient) {
            matchesTags = false;
            break;
          }
        }

        for (let j = 0; j < selectedTags.appareils.length; j++) {
          if (recette.appliance?.toLowerCase() !== selectedTags.appareils[j].toLowerCase()) {
            matchesTags = false;
            break;
          }
        }

        for (let j = 0; j < selectedTags.ustensiles.length; j++) {
          let foundUstensile = false;
          for (let k = 0; k < recette.ustensils.length; k++) {
            if (recette.ustensils[k].toLowerCase() === selectedTags.ustensiles[j].toLowerCase()) {
              foundUstensile = true;
              break;
            }
          }
          if (!foundUstensile) {
            matchesTags = false;
            break;
          }
        }

        if (matchesTags) {
          filteredRecipes.push(recette);
        }
        i++;
      }
    } else {
      filteredRecipes = recipes.slice(); // Copie de toutes les recettes si aucun tag
    }
  } else {
    let i = 0;
    while (i < recipes.length) {
      let recette = recipes[i];
      
      let correspondTexte = MainsearchText === '' || 
        recette.name.toLowerCase().includes(MainsearchText) ||  
        recette.description.toLowerCase().includes(MainsearchText);

      let correspondIngredientInput = ingredientInput === '' || 
        recette.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(ingredientInput));

      let correspondAppareilInput = appareilInput === '' || 
        recette.appliance?.toLowerCase().includes(appareilInput);

      let correspondUstensileInput = ustensileInput === '' || 
        recette.ustensils?.some(ustensile => ustensile.toLowerCase().includes(ustensileInput));

      let matchesTags = true;
      for (let j = 0; j < selectedTags.ingredients.length; j++) {
        let foundIngredient = false;
        for (let k = 0; k < recette.ingredients.length; k++) {
          if (recette.ingredients[k].ingredient.toLowerCase() === selectedTags.ingredients[j].toLowerCase()) {
            foundIngredient = true;
            break;
          }
        }
        if (!foundIngredient) {
          matchesTags = false;
          break;
        }
      }

      for (let j = 0; j < selectedTags.appareils.length; j++) {
        if (recette.appliance?.toLowerCase() !== selectedTags.appareils[j].toLowerCase()) {
          matchesTags = false;
          break;
        }
      }

      for (let j = 0; j < selectedTags.ustensiles.length; j++) {
        let foundUstensile = false;
        for (let k = 0; k < recette.ustensils.length; k++) {
          if (recette.ustensils[k].toLowerCase() === selectedTags.ustensiles[j].toLowerCase()) {
            foundUstensile = true;
            break;
          }
        }
        if (!foundUstensile) {
          matchesTags = false;
          break;
        }
      }

      if (correspondTexte && correspondIngredientInput && correspondAppareilInput && correspondUstensileInput && matchesTags) {
        filteredRecipes.push(recette);
      }
      i++;
    }
  }

  displayRecipes(filteredRecipes);

  let totalRecipesCount;
  if (filteredRecipes.length === 50) {
    totalRecipesCount = 1500;
  } else {
    totalRecipesCount = isAllEmpty ? 1500 : filteredRecipes.length;
  }

  updateRecipeCount(totalRecipesCount);
  updateAdvancedFilters(filteredRecipes);

  if (filteredRecipes.length === 0) {
    showErrorMessage(MainsearchText);
  } else {
    hideErrorMessage();
  }
}



document.getElementById('main-search-input').addEventListener('input', function () {
  const clearBtn = document.getElementById('main-clear-search');
  // Vérifiez si le champ de recherche a du texte
  if (this.value.length > 0) {
    clearBtn.classList.remove('hidden'); // Affiche la croix si du texte est saisi
    hideErrorMessage();
  } else {
    clearBtn.classList.add('hidden'); // Masque la croix si l'input est vide
  }
});

// Gestion du bouton "clear" pour effacer le texte de la barre de recherche
document.getElementById('main-clear-search').addEventListener('click', function () {
  const MainsearchInput = document.getElementById('main-search-input');
  MainsearchInput.value = ''; // Efface le texte de l'input
  this.classList.add('hidden'); // Masque la croix après avoir effacé le texte
  hideErrorMessage();
  MainsearchInput.focus(); // Remet le focus sur l'input après avoir effacé
  MainfilterRecipes(); // Met à jour les résultats

  // Appelez filterOptions pour filtrer les options selon le texte de l'input
  filterOptions('main-search-input', 'ulId'); // Remplacez 'ulId' par l'ID réel de votre liste d'options
});

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
  
