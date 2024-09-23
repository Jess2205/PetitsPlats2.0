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

document.addEventListener('DOMContentLoaded', () => {
  const ingredientsLabel = document.querySelector('label[for="ingredients"]');
  const ingredientsInputContainer = document.getElementById('ingredients-input-container');
  const ingredientsSelect = document.getElementById('ingredients');

  let isInputVisible = false; // Gérer l'état d'affichage de l'input

  // Affiche ou masque le conteneur d'input lorsque le label est cliqué
  ingredientsLabel.addEventListener('click', (e) => {
    e.preventDefault(); // Empêche le comportement par défaut du label
    isInputVisible = !isInputVisible;

    if (isInputVisible) {
      ingredientsInputContainer.classList.remove('opacity-0', 'pointer-events-none'); // Affiche l'input
      ingredientsLabel.classList.remove('label-hidden'); // Garde le padding
      ingredientsInputContainer.querySelector('input').focus(); // Met le focus sur l'input
    } else {
      ingredientsInputContainer.classList.add('opacity-0', 'pointer-events-none'); // Masque l'input
      ingredientsLabel.classList.add('label-hidden'); // Réduit le padding
    }
  });

  // Garde le conteneur affiché après la sélection d'un ingrédient
  ingredientsSelect.addEventListener('change', () => {
    // Quand un ingrédient est sélectionné, on garde le conteneur ouvert
    if (ingredientsSelect.value) {
      isInputVisible = true;
      ingredientsInputContainer.classList.remove('opacity-0', 'pointer-events-none'); // Garde visible
      ingredientsLabel.classList.remove('label-hidden'); // Garde le padding
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const ingredientsLabel = document.querySelector('label[for="ingredients"]');
  const ingredientsInputContainer = document.getElementById('ingredients-input-container');
  const ingredientsSelect = document.getElementById('ingredients');
  const ingredientsInput = document.getElementById('ingredients-search'); // L'input de recherche des ingrédients
  const clearSearchBtn = document.getElementById('clear-search'); // Le bouton croix pour effacer

  let isInputVisible = false; // Gérer l'état d'affichage de l'input
  let placeholderText = ingredientsInput.placeholder; // Stocker le texte initial du placeholder

  // Affiche ou masque le conteneur d'input lorsque le label est cliqué
  ingredientsLabel.addEventListener('click', (e) => {
    e.preventDefault(); // Empêche le comportement par défaut du label
    isInputVisible = !isInputVisible;

    if (isInputVisible) {
      ingredientsInputContainer.classList.remove('opacity-0', 'pointer-events-none'); // Affiche l'input
      ingredientsLabel.classList.remove('label-hidden'); // Garde le padding
      ingredientsInput.focus(); // Met le focus sur l'input
    } else {
      ingredientsInputContainer.classList.add('opacity-0', 'pointer-events-none'); // Masque l'input
      ingredientsLabel.classList.add('label-hidden'); // Réduit le padding
    }
  });

  // Efface le placeholder au focus
  ingredientsInput.addEventListener('focus', () => {
    ingredientsInput.placeholder = ''; // Vide le placeholder
  });

  // Remet le placeholder si l'input est vide après avoir perdu le focus
  ingredientsInput.addEventListener('blur', () => {
    if (ingredientsInput.value === '') {
      ingredientsInput.placeholder = placeholderText; // Remet le placeholder initial
    }
  });

  // Affiche la croix lorsque du texte est saisi
  ingredientsInput.addEventListener('input', () => {
    if (ingredientsInput.value !== '') {
      clearSearchBtn.classList.remove('hidden'); // Affiche la croix
    } else {
      clearSearchBtn.classList.add('hidden'); // Masque la croix si l'input est vide
    }
  });

  // Efface le texte de recherche lorsque l'utilisateur clique sur la croix
  clearSearchBtn.addEventListener('click', () => {
    ingredientsInput.value = ''; // Efface le texte de l'input
    clearSearchBtn.classList.add('hidden'); // Masque la croix après avoir effacé le texte
    ingredientsInput.focus(); // Remet le focus sur l'input après avoir effacé
  });

  // Vide le texte de recherche après la sélection d'un ingrédient
  ingredientsSelect.addEventListener('change', () => {
    if (ingredientsSelect.value) {
      ingredientsInput.value = ''; // Efface le texte saisi dans l'input
      clearSearchBtn.classList.add('hidden'); // Masque la croix
      isInputVisible = true;
      ingredientsInputContainer.classList.remove('opacity-0', 'pointer-events-none'); // Garde l'input visible si besoin
      ingredientsLabel.classList.remove('label-hidden'); // Garde le padding
    }
  });
});
