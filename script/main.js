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

// Branche 2 : Boucles While et For
// Fonction principale de filtrage des recettes
export function MainfilterRecipes() { 
  console.time('MainfilterRecipes'); // Démarre le chronométrage pour mesurer la durée d'exécution de la fonction

  hideRecipes(); // Vide le conteneur des recettes affichées sur la page

  // Récupération des valeurs des champs de recherche principaux (texte, ingrédients, appareils, ustensiles)
  const MainsearchInput = document.getElementById('main-search-input');
  const MainsearchText = MainsearchInput.value.trim().toLowerCase(); // Texte principal

  const ingredientInput = document.getElementById('ingredients-search').value.trim().toLowerCase(); // Ingrédient
  const appareilInput = document.getElementById('appareils-search').value.trim().toLowerCase(); // Appareil
  const ustensileInput = document.getElementById('ustensiles-search').value.trim().toLowerCase(); // Ustensile

  // Vérifie si tous les champs de recherche et les tags sont vides
  const isAllEmpty = MainsearchText === '' && ingredientInput === '' && appareilInput === '' && ustensileInput === '' &&
    selectedTags.ingredients.length === 0 &&
    selectedTags.appareils.length === 0 &&
    selectedTags.ustensiles.length === 0;

  let filteredRecipes = []; // Tableau pour stocker les recettes filtrées

  // Si moins de 3 caractères sont entrés dans la recherche principale
  if (MainsearchText.length < 3) {
    if (selectedTags.ingredients.length > 0 || selectedTags.appareils.length > 0 || selectedTags.ustensiles.length > 0) {
      // Si des tags sont sélectionnés, on filtre en fonction de ces tags
      let i = 0;
      while (i < recipes.length) { // Parcourt toutes les recettes
        let recette = recipes[i];
        let matchesTags = true; // Indicateur de correspondance des tags

        // Filtrage par tag d'ingrédient
        for (let j = 0; j < selectedTags.ingredients.length; j++) {
          let foundIngredient = false;
          for (let k = 0; k < recette.ingredients.length; k++) {
            if (recette.ingredients[k].ingredient.toLowerCase() === selectedTags.ingredients[j].toLowerCase()) {
              foundIngredient = true;
              break; // Si l'ingrédient est trouvé, on quitte la boucle interne
            }
          }
          if (!foundIngredient) { // Si aucun ingrédient ne correspond, on exclut la recette
            matchesTags = false;
            break;
          }
        }

        // Filtrage par tag d'appareil
        for (let j = 0; j < selectedTags.appareils.length; j++) {
          if (recette.appliance?.toLowerCase() !== selectedTags.appareils[j].toLowerCase()) {
            matchesTags = false;
            break;
          }
        }

        // Filtrage par tag d'ustensile
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

        // Si la recette correspond à tous les tags, elle est ajoutée aux recettes filtrées
        if (matchesTags) {
          filteredRecipes.push(recette);
        }
        i++;
      }
    } else {
      // Si aucun tag ni recherche n'est activé, toutes les recettes sont affichées
      filteredRecipes = recipes.slice(); // Copie du tableau original des recettes
    }
  } else {
    // Si au moins 3 caractères sont entrés dans la barre de recherche principale
    let i = 0;
    while (i < recipes.length) {
      let recette = recipes[i];
      
      // Vérifie si la recette correspond au texte recherché
      let correspondTexte = MainsearchText === '' || 
        recette.name.toLowerCase().includes(MainsearchText) ||  
        recette.description.toLowerCase().includes(MainsearchText);

      // Vérifie si la recette contient l'ingrédient recherché
      let correspondIngredientInput = ingredientInput === '' || 
        recette.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(ingredientInput));

      // Vérifie si la recette utilise l'appareil recherché
      let correspondAppareilInput = appareilInput === '' || 
        recette.appliance?.toLowerCase().includes(appareilInput);

      // Vérifie si la recette contient l'ustensile recherché
      let correspondUstensileInput = ustensileInput === '' || 
        recette.ustensils?.some(ustensile => ustensile.toLowerCase().includes(ustensileInput));

      // Vérifie si la recette correspond aux tags sélectionnés (similaire au filtre précédent)
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

      // Filtrage par tag d'appareil
      for (let j = 0; j < selectedTags.appareils.length; j++) {
        if (recette.appliance?.toLowerCase() !== selectedTags.appareils[j].toLowerCase()) {
          matchesTags = false;
          break;
        }
      }

      // Filtrage par tag d'ustensile
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

      // Si la recette correspond à tous les critères, elle est ajoutée à la liste des recettes filtrées
      if (correspondTexte && correspondIngredientInput && correspondAppareilInput && correspondUstensileInput && matchesTags) {
        filteredRecipes.push(recette);
      }
      i++;
    }
  }

  // Affiche les recettes filtrées sur la page
  displayRecipes(filteredRecipes);

  // Mise à jour du compteur de recettes et des filtres avancés
  let totalRecipesCount;
  if (filteredRecipes.length === 50) {
    totalRecipesCount = 1500; // Hypothèse: si 50 recettes affichées, on considère un total fictif de 1500
  } else {
    totalRecipesCount = isAllEmpty ? 1500 : filteredRecipes.length; // Total réel ou fictif en cas de champ vide
  }

  updateRecipeCount(totalRecipesCount); // Mise à jour du nombre de recettes affichées
  updateAdvancedFilters(filteredRecipes); // Mise à jour des options des filtres avancés en fonction des résultats

  // Gestion des erreurs si aucune recette n'est trouvée
  if (filteredRecipes.length === 0) {
    showErrorMessage(MainsearchText);
  } else {
    hideErrorMessage();
  }

  console.timeEnd('MainfilterRecipes'); // Termine le chronométrage et affiche la durée d'exécution
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
  
