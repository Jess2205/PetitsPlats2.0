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
    selectElement.innerHTML = '<option value=""></option>';
    items.forEach(item => {
      const option = document.createElement('option');
      option.value = item;
      option.textContent = item;
      selectElement.appendChild(option);
      
      
    });
  };
  const selectElement = document.querySelector('select');
  const optionTous = Array.from(selectElement.options).find(option => option.text === '');
  
  if (optionTous) {
      selectElement.removeChild(optionTous);
  }
  
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
  const searchText = searchInput.value.trim().toLowerCase();

  console.log('Search Text:', searchText); // Vérifie ce qui est saisi

  if (searchText.length < 3) {
    return;
  }

  const selectedIngredients = Array.from(document.getElementById('ingredients').selectedOptions).map(option => option.value.toLowerCase());
  const selectedAppareils = Array.from(document.getElementById('appareils').selectedOptions).map(option => option.value.toLowerCase());
  const selectedUstensiles = Array.from(document.getElementById('ustensiles').selectedOptions).map(option => option.value.toLowerCase());

  const recettesFiltrees = recipes.filter(recette => {
    const correspondTexte = recette.name.toLowerCase().includes(searchText) ||
                            recette.description.toLowerCase().includes(searchText) ||
                            recette.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(searchText));

    const correspondIngredients = !selectedIngredients.length || recette.ingredients.some(ingredient => selectedIngredients.includes(ingredient.ingredient.toLowerCase()));
    const correspondAppareils = !selectedAppareils.length || selectedAppareils.includes(recette.appliance?.toLowerCase() || '');
    const correspondUstensiles = !selectedUstensiles.length || recette.ustensils?.some(ustensile => selectedUstensiles.includes(ustensile.toLowerCase())) || false;

    return correspondTexte && correspondIngredients && correspondAppareils && correspondUstensiles;
  });

  // Mise à jour du compteur de recettes
  document.getElementById('total-recipes').textContent = `${recettesFiltrees.length} recettes`;

  if (recettesFiltrees.length === 0) {
    showErrorMessage(searchText);
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

  // Ajoute l'écouteur d'événement pour le champ de recherche
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

//Filtres Ingrédients, appareils et ustensiles
document.addEventListener('DOMContentLoaded', () => {
  function setupFilter(labelFor, containerId, selectId, inputId, clearBtnId) {
    const label = document.querySelector(`label[for="${labelFor}"]`);
    const inputContainer = document.getElementById(containerId);
    const select = document.getElementById(selectId);
    const input = document.getElementById(inputId);
    const clearBtn = document.getElementById(clearBtnId);

    let isInputVisible = false; // Gérer l'état d'affichage de l'input
    let placeholderText = input.placeholder; // Stocker le texte initial du placeholder

    // Affiche ou masque le conteneur d'input lorsque le label est cliqué
    label.addEventListener('click', (e) => {
      e.preventDefault(); // Empêche le comportement par défaut du label
      isInputVisible = !isInputVisible;

      if (isInputVisible) {
        inputContainer.classList.remove('opacity-0', 'pointer-events-none'); // Affiche l'input
        label.classList.remove('label-hidden'); // Garde le padding
        input.focus(); // Met le focus sur l'input
      } else {
        inputContainer.classList.add('opacity-0', 'pointer-events-none'); // Masque l'input
        label.classList.add('label-hidden'); // Réduit le padding
      }
    });

    // Efface le placeholder au focus
    input.addEventListener('focus', () => {
      input.placeholder = ''; // Vide le placeholder
    });

    // Remet le placeholder si l'input est vide après avoir perdu le focus
    input.addEventListener('blur', () => {
      if (input.value === '') {
        input.placeholder = placeholderText; // Remet le placeholder initial
      }
    });

    // Affiche la croix lorsque du texte est saisi
    input.addEventListener('input', () => {
      if (input.value !== '') {
        clearBtn.classList.remove('hidden'); // Affiche la croix
      } else {
        clearBtn.classList.add('hidden'); // Masque la croix si l'input est vide
      }
    });

    // Efface le texte de recherche lorsque l'utilisateur clique sur la croix
    clearBtn.addEventListener('click', () => {
      input.value = ''; // Efface le texte de l'input
      clearBtn.classList.add('hidden'); // Masque la croix après avoir effacé le texte
      input.focus(); // Remet le focus sur l'input après avoir effacé
    });

    // Garde le conteneur affiché après la sélection d'un ingrédient/appareil/ustensile
    select.addEventListener('change', () => {
      if (select.value) {
        input.value = ''; // Efface le texte saisi dans l'input
        clearBtn.classList.add('hidden'); // Masque la croix
        isInputVisible = true;
        inputContainer.classList.remove('opacity-0', 'pointer-events-none'); // Garde l'input visible
        label.classList.remove('label-hidden'); // Garde le padding
      }
    });
  }

  // Configuration des filtres
  setupFilter('ingredients', 'ingredients-input-container', 'ingredients', 'ingredients-search', 'ingredients-clear-search');
  setupFilter('appareils', 'appareils-input-container', 'appareils', 'appareils-search', 'appareils-clear-search');
  setupFilter('ustensiles', 'ustensiles-input-container', 'ustensiles', 'ustensiles-search', 'ustensiles-clear-search');
});
