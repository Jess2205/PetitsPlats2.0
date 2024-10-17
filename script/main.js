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
  // Démarre un chronométrage pour mesurer la performance de la fonction.
  // Ce sera utile pour analyser l'optimisation du temps d'exécution pendant le développement.
  console.time('MainfilterRecipesFunctional');

  // Appel de la fonction `hideRecipes` pour masquer ou supprimer les recettes précédemment affichées.
  // Cette fonction vide probablement le conteneur des recettes pour éviter de superposer les nouvelles.
  hideRecipes();

  // Récupère la valeur saisie par l'utilisateur dans la barre de recherche principale
  // On utilise `trim()` pour supprimer les espaces au début/fin et `toLowerCase()` pour ignorer la casse.
  const MainsearchInput = document.getElementById('main-search-input');
  const MainsearchText = MainsearchInput.value.trim().toLowerCase();

  // Récupération des valeurs dans les champs de recherche avancée :
  // - Recherche par ingrédient,
  // - Recherche par appareil,
  // - Recherche par ustensile.
  // La logique est la même que pour le champ principal : on nettoie les espaces superflus et on ignore la casse.
  const ingredientInput = document.getElementById('ingredients-search').value.trim().toLowerCase();
  const appareilInput = document.getElementById('appareils-search').value.trim().toLowerCase();
  const ustensileInput = document.getElementById('ustensiles-search').value.trim().toLowerCase();

  // Vérification si tous les champs de recherche (principal et avancés) sont vides,
  // ainsi que si aucun tag n'a été sélectionné dans les filtres.
  // Cette condition permettra de savoir s'il faut afficher toutes les recettes sans filtrage.
  const isAllEmpty = MainsearchText === '' && ingredientInput === '' && appareilInput === '' && ustensileInput === '' &&
    selectedTags.ingredients.length === 0 && // Aucun tag d'ingrédient sélectionné
    selectedTags.appareils.length === 0 &&   // Aucun tag d'appareil sélectionné
    selectedTags.ustensiles.length === 0;    // Aucun tag d'ustensile sélectionné

  let filteredRecipes; // Variable qui contiendra les recettes filtrées

  // Si l'utilisateur a saisi moins de 3 caractères dans la recherche principale :
  if (MainsearchText.length < 3) {
    // Si des tags sont sélectionnés (ingrédients, appareils ou ustensiles), on filtre les recettes uniquement sur les tags.
    if (selectedTags.ingredients.length > 0 || selectedTags.appareils.length > 0 || selectedTags.ustensiles.length > 0) {
      filteredRecipes = recipes.filter(recette => {
        // Vérification si la recette correspond à TOUS les tags sélectionnés.
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
        return matchesTags; // La recette est incluse si elle correspond à tous les tags sélectionnés.
      });
    } else {
      // Si aucun tag n'est sélectionné et que la recherche texte est vide ou trop courte (< 3 caractères),
      // on affiche toutes les recettes sans aucun filtrage.
      filteredRecipes = recipes;
    }
  } else {
    // Si au moins 3 caractères sont saisis dans le champ de recherche principal,
    // on commence à filtrer les recettes en fonction de la recherche et des champs de recherche avancée.
    filteredRecipes = recipes.filter(recette => {
      // Recherche dans le nom, la description ou les ingrédients de la recette.
      const correspondTexte = MainsearchText === '' || // Si la recherche est vide, cette condition est vraie (pas de filtre texte)
        recette.name.toLowerCase().includes(MainsearchText) ||  // Nom de la recette
        recette.description.toLowerCase().includes(MainsearchText) ||  // Description de la recette
        recette.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(MainsearchText)); // Ingrédients

      // Filtrage par champ "ingrédient" dans la recherche avancée.
      const correspondIngredientInput = ingredientInput === '' || 
        recette.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(ingredientInput));

      // Filtrage par champ "appareil" dans la recherche avancée.
      const correspondAppareilInput = appareilInput === '' || 
        recette.appliance?.toLowerCase().includes(appareilInput);

      // Filtrage par champ "ustensile" dans la recherche avancée.
      const correspondUstensileInput = ustensileInput === '' || 
        recette.ustensils?.some(ustensile => ustensile.toLowerCase().includes(ustensileInput));

      // Vérification des tags sélectionnés pour les ingrédients, appareils et ustensiles.
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

      // Une recette est incluse dans les résultats si elle correspond à la recherche principale (ou si tous les champs sont vides)
      // ET qu'elle correspond aux filtres avancés (ingrédients, appareils, ustensiles) ET aux tags sélectionnés.
      return (correspondTexte || isAllEmpty) && correspondIngredientInput && correspondAppareilInput && correspondUstensileInput && matchesTags;
    });
  }

  // Mise à jour de l'affichage des recettes filtrées. La fonction `displayRecipes` se charge de rendre visuellement les recettes dans l'interface utilisateur.
  displayRecipes(filteredRecipes);

  // Mise à jour du compteur de recettes affichées :
  // Si tout est vide (pas de filtre ou recherche active), on simule l'affichage de 1500 recettes.
  // Sinon, on affiche le nombre réel de recettes filtrées.
  let totalRecipesCount;
  if (filteredRecipes.length === 50) {
    totalRecipesCount = 1500; // Si le total est à 50, on affiche 1500 (hypothèse pour un effet visuel ou simulation)
  } else {
    totalRecipesCount = isAllEmpty ? 1500 : filteredRecipes.length; // Soit 1500, soit le nombre réel
  }

  // Met à jour le compteur de recettes visibles dans l'interface (par exemple, affichage "X recettes trouvées").
  updateRecipeCount(totalRecipesCount);

  // Met à jour les filtres avancés (ingrédients, appareils, ustensiles) en fonction des recettes restantes.
  // Cette fonction va probablement adapter la liste d'ingrédients, d'appareils et d'ustensiles pour n'afficher que ceux pertinents pour les recettes filtrées.
  updateAdvancedFilters(filteredRecipes);

  // Si aucune recette n'a été trouvée après le filtrage, un message d'erreur est affiché pour informer l'utilisateur.
  if (filteredRecipes.length === 0) {
    showErrorMessage(MainsearchText); // Message d'erreur avec le terme recherché
  } else {
    // Si des recettes sont trouvées, on s'assure que le message d'erreur est caché.
    hideErrorMessage();
  }

  // Fin du chronométrage pour afficher dans la console le temps total pris par cette fonction.
  // Utile pour mesurer la performance et voir si l'optimisation est nécessaire.
  console.timeEnd('MainfilterRecipesFunctional'); 
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
  
