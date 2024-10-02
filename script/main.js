import { recipes } from './recipes.js'; // Assurez-vous que le chemin est correct
import { displayRecipes, showErrorMessage, hideErrorMessage } from './index.js'; // Assurez-vous que le chemin est correct
import { displayTags } from './filtres.js';

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

  const updateOptions = (ul, items) => {
    ul.innerHTML = ''; // Réinitialiser le contenu de la liste
    items.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      li.dataset.value = item; // Ajouter une donnée pour la sélection
      ul.appendChild(li);
    });
  };

  updateOptions(document.getElementById('ingredients'), [...filters.ingredients]);
  updateOptions(document.getElementById('appareils'), [...filters.appareils]);
  updateOptions(document.getElementById('ustensiles'), [...filters.ustensiles]);
}


// Fonction de filtrage des options dans les filtres avancés
function filterOptions(inputId, ulId) {
  const searchText = document.getElementById(inputId).value.toLowerCase();
  const ul = document.getElementById(ulId);
  
  Array.from(ul.children).forEach(li => {
    li.style.display = li.dataset.value.toLowerCase().includes(searchText) || searchText === "" ? "block" : "none";
  });
}

// Fonction de filtrage des recettes
function filterRecipes() {
  const searchInput = document.getElementById('search-input');
  const searchText = searchInput.value.trim().toLowerCase();

  console.log('Search Text:', searchText); // Vérifie ce qui est saisi

  if (searchText.length < 3) {
    return; // Ne pas filtrer si moins de 3 caractères
  }
  
  const selectedIngredients = Array.from(document.querySelectorAll('#ingredients li.selected')).map(li => li.dataset.value.toLowerCase());
  const selectedAppareils = Array.from(document.querySelectorAll('#appareils li.selected')).map(li => li.dataset.value.toLowerCase());
  const selectedUstensiles = Array.from(document.querySelectorAll('#ustensiles li.selected')).map(li => li.dataset.value.toLowerCase());

  const recettesFiltrees = [];
  
  // Remplacer la méthode filter par une boucle for
  for (let i = 0; i < recipes.length; i++) {
    const recette = recipes[i];
    const correspondTexte = recette.name.toLowerCase().includes(searchText) ||
                            recette.description.toLowerCase().includes(searchText) ||
                            recette.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(searchText));

    const correspondIngredients = !selectedIngredients.length || recette.ingredients.some(ingredient => selectedIngredients.includes(ingredient.ingredient.toLowerCase()));
    const correspondAppareils = !selectedAppareils.length || selectedAppareils.includes(recette.appliance?.toLowerCase() || '');
    const correspondUstensiles = !selectedUstensiles.length || recette.ustensils?.some(ustensile => selectedUstensiles.includes(ustensile.toLowerCase())) || false;

    if (correspondTexte && correspondIngredients && correspondAppareils && correspondUstensiles) {
      recettesFiltrees.push(recette);
    }
  }

  // Mise à jour du compteur de recettes
  const totalRecipes = recettesFiltrees.length;

  // Formater le compteur
  const formattedTotal = totalRecipes < 10 ? totalRecipes.toString().padStart(2, '0') : totalRecipes;

  // Déterminer le suffixe
  const suffix = totalRecipes === 1 ? 'recette' : 'recettes';

  // Mettre à jour le texte du compteur
  document.getElementById('total-recipes').textContent = `${formattedTotal} ${suffix}`;

  if (totalRecipes === 0) {
    showErrorMessage(searchText); // Montre un message d'erreur si aucune recette ne correspond
  } else {
    hideErrorMessage(); // Masque le message d'erreur
    displayRecipes(recettesFiltrees); // Affiche les recettes filtrées
    updateAdvancedFilters(recettesFiltrees); // Met à jour les filtres avancés
  }
}

// Écouteur d'événements pour la barre de recherche principale
document.getElementById('search-input').addEventListener('input', function () {
  const clearBtn = document.getElementById('main-clear-search');
  // Vérifiez si le champ de recherche a du texte
  if (this.value.length > 0) {
    clearBtn.classList.remove('hidden'); // Affiche la croix
  } else {
    clearBtn.classList.add('hidden'); // Masque la croix si l'input est vide
  }
});

// Efface le texte de recherche lorsque l'utilisateur clique sur la croix
document.getElementById('main-clear-search').addEventListener('click', function () {
  const searchInput = document.getElementById('search-input');
  searchInput.value = ''; // Efface le texte de l'input
  this.classList.add('hidden'); // Masque la croix après avoir effacé le texte
  searchInput.focus(); // Remet le focus sur l'input après avoir effacé
});

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
    filtre.addEventListener('click', (e) => {
      if (e.target.tagName === 'LI') {
        e.target.classList.toggle('selected'); // Ajoute ou enlève la classe 'selected'
        filterRecipes(); // Filtrer les recettes après la sélection
      }
    });
  });
});

// Filtres Ingrédients, appareils et ustensiles
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
        clearBtn.classList.add('hidden'); // Masque la croix
      }
    });

    // Efface le texte de l'input et masque la croix
    clearBtn.addEventListener('click', () => {
      input.value = ''; // Efface le texte de l'input
      clearBtn.classList.add('hidden'); // Masque la croix
      filterOptions(inputId, containerId); // Met à jour les options filtrées
      input.focus(); // Remet le focus sur l'input
    });
  }

  /// Configuration des filtres
  setupFilter('ingredients', 'ingredients-input-container', 'ingredients', 'ingredients-search', 'ingredients-clear-search');
  setupFilter('appareils', 'appareils-input-container', 'appareils', 'appareils-search', 'appareils-clear-search');
  setupFilter('ustensiles', 'ustensiles-input-container', 'ustensiles', 'ustensiles-search', 'ustensiles-clear-search');
});