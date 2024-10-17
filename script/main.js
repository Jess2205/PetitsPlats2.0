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
  console.time('MainfilterRecipes'); // Démarre le chronométrage pour mesurer la performance de la fonction.

  hideRecipes(); // Vide le conteneur des recettes actuellement affichées, préparant l'affichage des nouvelles recettes filtrées.

  // Récupération des valeurs des champs de recherche principaux : texte principal, ingrédients, appareils, ustensiles.
  const MainsearchInput = document.getElementById('main-search-input');
  const MainsearchText = MainsearchInput.value.trim().toLowerCase(); // Le texte saisi dans la recherche principale, converti en minuscule et sans espace superflu.

  const ingredientInput = document.getElementById('ingredients-search').value.trim().toLowerCase(); // Le texte pour filtrer par ingrédient.
  const appareilInput = document.getElementById('appareils-search').value.trim().toLowerCase(); // Le texte pour filtrer par appareil.
  const ustensileInput = document.getElementById('ustensiles-search').value.trim().toLowerCase(); // Le texte pour filtrer par ustensile.

  // Vérifie si tous les champs de recherche sont vides, y compris les tags sélectionnés pour ingrédients, appareils et ustensiles.
  const isAllEmpty = MainsearchText === '' && ingredientInput === '' && appareilInput === '' && ustensileInput === '' &&
    selectedTags.ingredients.length === 0 &&
    selectedTags.appareils.length === 0 &&
    selectedTags.ustensiles.length === 0;

  let filteredRecipes = []; // Initialisation du tableau des recettes filtrées.

  // Si le texte dans la recherche principale contient moins de 3 caractères :
  if (MainsearchText.length < 3) {
    if (selectedTags.ingredients.length > 0 || selectedTags.appareils.length > 0 || selectedTags.ustensiles.length > 0) {
      // Si des tags sont sélectionnés, on filtre les recettes uniquement en fonction des tags.
      let i = 0;
      while (i < recipes.length) {
        let recette = recipes[i]; // Accès à chaque recette dans la liste globale.
        let matchesTags = true; // Indicateur de correspondance initialisé à `true`, changera à `false` si un tag ne correspond pas.

        // Filtre par tag d'ingrédient.
        for (let j = 0; j < selectedTags.ingredients.length; j++) {
          let foundIngredient = false;
          for (let k = 0; k < recette.ingredients.length; k++) {
            if (recette.ingredients[k].ingredient.toLowerCase() === selectedTags.ingredients[j].toLowerCase()) {
              foundIngredient = true; // Correspondance trouvée pour l'ingrédient, on peut sortir de cette boucle.
              break;
            }
          }
          if (!foundIngredient) { 
            matchesTags = false; // Si aucun ingrédient ne correspond, on arrête et on exclut cette recette.
            break;
          }
        }

        // Filtre par tag d'appareil.
        for (let j = 0; j < selectedTags.appareils.length; j++) {
          if (recette.appliance?.toLowerCase() !== selectedTags.appareils[j].toLowerCase()) {
            matchesTags = false; // L'appareil ne correspond pas, on exclut la recette.
            break;
          }
        }

        // Filtre par tag d'ustensile.
        for (let j = 0; j < selectedTags.ustensiles.length; j++) {
          let foundUstensile = false;
          for (let k = 0; k < recette.ustensils.length; k++) {
            if (recette.ustensils[k].toLowerCase() === selectedTags.ustensiles[j].toLowerCase()) {
              foundUstensile = true; // Correspondance trouvée pour l'ustensile.
              break;
            }
          }
          if (!foundUstensile) { 
            matchesTags = false; // L'ustensile ne correspond pas, on exclut la recette.
            break;
          }
        }

        // Si la recette correspond à tous les tags, elle est ajoutée aux résultats filtrés.
        if (matchesTags) {
          filteredRecipes.push(recette);
        }
        i++;
      }
    } else {
      // Si aucun tag n'est sélectionné et aucun texte de recherche n'est saisi, toutes les recettes sont affichées.
      filteredRecipes = recipes.slice(); // On copie le tableau original des recettes.
    }
  } else {
    // Si le texte principal contient 3 caractères ou plus, on filtre en fonction du texte et des tags sélectionnés.
    let i = 0;
    while (i < recipes.length) {
      let recette = recipes[i];
      
      // Vérifie si la recette correspond au texte recherché dans le nom ou la description.
      let correspondTexte = MainsearchText === '' || 
        recette.name.toLowerCase().includes(MainsearchText) ||  
        recette.description.toLowerCase().includes(MainsearchText);

      // Vérifie si la recette contient l'ingrédient recherché.
      let correspondIngredientInput = ingredientInput === '' || 
        recette.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(ingredientInput));

      // Vérifie si la recette utilise l'appareil recherché.
      let correspondAppareilInput = appareilInput === '' || 
        recette.appliance?.toLowerCase().includes(appareilInput);

      // Vérifie si la recette contient l'ustensile recherché.
      let correspondUstensileInput = ustensileInput === '' || 
        recette.ustensils?.some(ustensile => ustensile.toLowerCase().includes(ustensileInput));

      // Vérifie si la recette correspond aux tags sélectionnés (ingrédients, appareils, ustensiles).
      let matchesTags = true;

      // Même logique de filtrage par tags comme précédemment.
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

      // Filtre par tag d'appareil.
      for (let j = 0; j < selectedTags.appareils.length; j++) {
        if (recette.appliance?.toLowerCase() !== selectedTags.appareils[j].toLowerCase()) {
          matchesTags = false;
          break;
        }
      }

      // Filtre par tag d'ustensile.
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

      // Si la recette correspond à tous les critères de texte, d'ingrédient, d'appareil, d'ustensile, et de tags, on l'ajoute aux résultats.
      if (correspondTexte && correspondIngredientInput && correspondAppareilInput && correspondUstensileInput && matchesTags) {
        filteredRecipes.push(recette);
      }
      i++;
    }
  }

  // Affiche les recettes filtrées.
  displayRecipes(filteredRecipes);

  // Mise à jour du compteur de recettes et des filtres avancés.
  let totalRecipesCount;
  if (filteredRecipes.length === 50) {
    totalRecipesCount = 1500; // Indicateur fictif pour représenter un grand ensemble de résultats.
  } else {
    totalRecipesCount = isAllEmpty ? 1500 : filteredRecipes.length; // Mise à jour du total réel ou fictif.
  }

  // Mise à jour de l'interface avec le nombre de recettes et les options de filtre.
  updateRecipeCount(totalRecipesCount);
  updateAdvancedFilters(filteredRecipes);

  // Si aucune recette n'est trouvée, affiche un message d'erreur.
  if (filteredRecipes.length === 0) {
    showErrorMessage(MainsearchText);
  } else {
    hideErrorMessage(); // Cache le message d'erreur si des recettes sont trouvées.
  }

  console.timeEnd('MainfilterRecipes'); // Termine le chronométrage et affiche la durée d'exécution de la fonction dans la console.
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
  
