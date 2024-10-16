import { recipes } from './recipes.js'; // Importation des données des recettes
import { displayRecipes, showErrorMessage, hideErrorMessage } from './index.js'; // Importation des fonctions pour afficher les recettes et gérer les messages d'erreur
import { displayTags, capitalizeFirstLetter, selectedTags, updateFilterOptions } from './filtres.js';// Importation de la fonction qui affiche les tags
import { updateRecipeCount } from './index.js';


// Fonction pour mettre à jour les options des filtres avancés
export function updateAdvancedFilters(recipes) {
  const filters = {
    ingredients: new Set(),
    appareils: new Set(),
    ustensiles: new Set()
  };

  // Parcourt chaque recette pour extraire les ingrédients, appareils et ustensiles
  recipes.forEach(recipe => {
    recipe.ingredients.forEach(ingredient => filters.ingredients.add(ingredient.ingredient));
    if (recipe.appliance) filters.appareils.add(recipe.appliance);
    recipe.ustensils.forEach(ustensile => filters.ustensiles.add(ustensile));
  });

  // Conversion des Set en tableau et capitalisation des premières lettres sans tri
  const sortedIngredients = [...new Set(
    Array.from(filters.ingredients).map(item => capitalizeFirstLetter(item))
  )];
  
  const sortedAppareils = [...new Set(
    Array.from(filters.appareils).map(item => capitalizeFirstLetter(item))
  )];
  
  const sortedUstensiles = [...new Set(
    Array.from(filters.ustensiles).map(item => capitalizeFirstLetter(item))
  )];

  // Fonction pour mettre à jour les listes d'options des filtres
  const updateOptions = (ul, items) => {
    if (ul) { // Vérifie que l'élément ul existe
      ul.innerHTML = ''; // Réinitialiser le contenu de la liste
      items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item; // Nom de l'option
        li.dataset.value = item.toLowerCase(); // Stocke la valeur en minuscules
        li.classList.add('cursor-pointer', 'hover:bg-yellow-300', 'py-2', 'px-4');
        ul.appendChild(li); // Ajoute l'élément à la liste
      });
    } else {
      console.error(`L'élément ${ul.id} n'a pas été trouvé.`);
    }
  };

  // Mise à jour des listes des filtres avec les options triées
  updateOptions(document.getElementById('ingredients'), sortedIngredients);
  updateOptions(document.getElementById('appareils'), sortedAppareils);
  updateOptions(document.getElementById('ustensiles'), sortedUstensiles);
}

// Fonction de filtrage des options dans les filtres avancés
function filterOptions(inputId, ulId) {
  const searchText = document.getElementById(inputId).value.toLowerCase();// Récupère le texte de recherche et le met en minuscules
  const ul = document.getElementById(ulId);// Sélectionne la liste correspondante

  // Parcourt chaque élément de la liste et ajuste leur affichage selon la correspondance avec le texte de recherche  
  Array.from(ul.children).forEach(li => {
    li.style.display = li.dataset.value.toLowerCase().includes(searchText) || searchText === "" ? "block" : "none";
  });
  
}

// Fonction principale de filtrage des recettes
export function MainfilterRecipes() { 
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
  
//Configuration des filtres Ingrédients, appareils et ustensiles
document.addEventListener('DOMContentLoaded', () => {
  function setupFilter(labelFor, containerId, ulId, inputId, clearBtnId) {
    const label = document.querySelector(`label[for="${labelFor}"]`);// Sélectionne le label lié à l'input
    const inputContainer = document.getElementById(containerId);// Sélectionne le conteneur de l'input
    const ul = document.getElementById(ulId); // Sélectionne la liste des éléments (Ingrédients/Appareils/Ustensiles)
    const input = document.getElementById(inputId);// Sélectionne l'input pour le filtre
    const clearBtn = document.getElementById(clearBtnId);// Sélectionne le bouton pour effacer le texte de recherche

    let isInputVisible = false; // Gérer l'état d'affichage de l'input
    let placeholderText = input.placeholder; // Stocker le texte initial du placeholder

    // Gestion de l'affichage/masquage du champ de recherche du filtre lors du clic sur le label
    label.addEventListener('click', (e) => {
      e.preventDefault(); // Empêche le comportement par défaut du label
      isInputVisible = !isInputVisible;// Alterne l'état de visibilité de l'input

      if (isInputVisible) {
        inputContainer.classList.remove('opacity-0', 'pointer-events-none'); // Affiche l'input
        label.classList.remove('label-hidden'); // Conserve l'espacement du label
        input.focus(); // Donne le focus sur l'input lorsque visible
      } else {
        inputContainer.classList.add('opacity-0', 'pointer-events-none'); // Masque l'input
        label.classList.add('label-hidden'); // Masque le label avec un padding réduit
      }
    });

    // Vide le placeholder lors du focus sur l'input
    input.addEventListener('focus', () => {
      input.placeholder = '';  // Retire le texte du placeholder
    });

    // Remet le placeholder si l'input est vide après avoir perdu le focus
    input.addEventListener('blur', () => {
      if (input.value === '') {
        input.placeholder = placeholderText; // Réinitialise le placeholder si aucun texte n'est saisi
      }
    });

    // Affiche ou masque le bouton de suppression en fonction de la saisie dans l'input
    input.addEventListener('input', () => {
      if (input.value !== '') {
        clearBtn.classList.remove('hidden'); // Affiche la croix pour effacer le texte
      } else {
        clearBtn.classList.add('hidden'); // Masque la croix si aucun texte n'est saisi
      }
    });

    // Gère le clic sur le bouton pour effacer la saisie et réinitialise l'état du champ de recherche
    clearBtn.addEventListener('click', () => {
      input.value = ''; // Vide le champ de recherche
      clearBtn.classList.add('hidden'); // Masque la croix de suppression
      input.focus(); // Remet le focus sur l'input après la suppression
    });

    // Gère la sélection dans la liste (UL) et déplace l'élément sélectionné en haut tout en supprimant les doublons
    ul.addEventListener('click', (e) => {
      const clickedItem = e.target; // Récupère l'élément <li> cliqué
      if (clickedItem.tagName.toLowerCase() === 'li') {
        const items = ul.querySelectorAll('li'); // Récupère tous les éléments <li>
        
        // Supprime les doublons du même élément dans la liste
        items.forEach(item => {
          if (item !== clickedItem && item.textContent.trim() === clickedItem.textContent.trim()) {
            item.remove(); // Supprime l'élément doublon
          }
        });

        // Déplace l'élément cliqué en haut de la liste
        ul.insertBefore(clickedItem, ul.firstChild);
      }

       // Conserve l'affichage du champ de recherche après sélection
      if (clickedItem) {
        input.value = '';  // Efface le texte du champ de recherche
        clearBtn.classList.add('hidden'); // Masque la croix
        isInputVisible = true;
        inputContainer.classList.remove('opacity-0', 'pointer-events-none'); // Conserve le champ de recherche visible
        label.classList.remove('label-hidden'); // Garde le padding
      }
    });
  }

 // Initialisation des filtres pour les ingrédients, appareils et ustensiles
  setupFilter('ingredients-search', 'ingredients-input-container', 'ingredients', 'ingredients-search', 'ingredients-clear-search');
  setupFilter('appareils-search', 'appareils-input-container', 'appareils', 'appareils-search', 'appareils-clear-search');
  setupFilter('ustensiles-search', 'ustensiles-input-container', 'ustensiles', 'ustensiles-search', 'ustensiles-clear-search');
});



