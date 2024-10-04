import { recipes } from './recipes.js'; // Importation des données des recettes
import { displayRecipes, showErrorMessage, hideErrorMessage } from './index.js'; // Importation des fonctions pour afficher les recettes et gérer les messages d'erreur
import { displayTags } from './filtres.js';// Importation de la fonction qui affiche les tags

// Fonction pour mettre à jour les options des filtres avancés
function updateAdvancedFilters(recipes) {
  const filters = {
    ingredients: new Set(),// Utilisation d'un Set pour éviter les doublons
    appareils: new Set(),
    ustensiles: new Set()
  };
// Parcourt chaque recette pour extraire les ingrédients, appareils et ustensiles
  recipes.forEach(recipe => {
    recipe.ingredients.forEach(ingredient => filters.ingredients.add(ingredient.ingredient));// Ajout des ingrédients
    if (recipe.appliance) filters.appareils.add(recipe.appliance);// Ajout des appareils s'ils existent
    recipe.ustensils.forEach(ustensile => filters.ustensiles.add(ustensile));// Ajout des ustensiles
  });
// Fonction pour mettre à jour les listes d'options des filtres (ingrédients, appareils, ustensiles)
  const updateOptions = (ul, items) => {
    ul.innerHTML = ''; // Réinitialiser le contenu de la liste
    items.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;// Nom de l'option
      li.dataset.value = item; // Stocke la valeur dans un dataset pour faciliter la sélection
      li.classList.add('cursor-pointer', 'hover:bg-yellow-300', 'py-2', 'px-4');
      ul.appendChild(li);// Ajoute l'élément à la liste
    });
  };
// Mise à jour des listes des filtres avec les nouvelles options disponibles
  updateOptions(document.getElementById('ingredients'), [...filters.ingredients]);
  updateOptions(document.getElementById('appareils'), [...filters.appareils]);
  updateOptions(document.getElementById('ustensiles'), [...filters.ustensiles]);
}

// Fonction de filtrage des options dans les filtres avancés
function filterOptions(inputId, ulId) {
  const searchText = document.getElementById(inputId).value.toLowerCase();// Récupère le texte de recherche et le met en minuscules
  const ul = document.getElementById(ulId);
// Parcourt chaque élément de la liste et ajuste leur affichage selon la correspondance avec le texte de recherche  
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
    return; // Ne commence le filtrage qu'après 3 caractères
  }

// Récupère les tags sélectionnés dans chaque filtre
  const selectedIngredients = Array.from(document.querySelectorAll('#ingredients li.selected')).map(li => li.dataset.value.toLowerCase());
  const selectedAppareils = Array.from(document.querySelectorAll('#appareils li.selected')).map(li => li.dataset.value.toLowerCase());
  const selectedUstensiles = Array.from(document.querySelectorAll('#ustensiles li.selected')).map(li => li.dataset.value.toLowerCase());
// Filtrage des recettes en fonction des critères de texte et des tags sélectionnés
  const recettesFiltrees = recipes.filter(recette => {
    const correspondTexte = recette.name.toLowerCase().includes(searchText) ||
                            recette.description.toLowerCase().includes(searchText) ||
                            recette.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(searchText));

    const correspondIngredients = !selectedIngredients.length || recette.ingredients.some(ingredient => selectedIngredients.includes(ingredient.ingredient.toLowerCase()));
    const correspondAppareils = !selectedAppareils.length || selectedAppareils.includes(recette.appliance?.toLowerCase() || '');
    const correspondUstensiles = !selectedUstensiles.length || recette.ustensils?.some(ustensile => selectedUstensiles.includes(ustensile.toLowerCase())) || false;
// Retourne vrai si la recette correspond à tous les critères
    return correspondTexte && correspondIngredients && correspondAppareils && correspondUstensiles;
  });

  // Mise à jour du compteur de recettes
  const totalRecipes = recettesFiltrees.length;

  // Formater le compteur
  const formattedTotal = totalRecipes < 10 ? totalRecipes.toString().padStart(2, '0') : totalRecipes;

  // Déterminer le suffixe
  const suffix = totalRecipes === 1 ? 'recette' : 'recettes';

// Mise à jour du texte avec le nombre de recettes trouvées
  document.getElementById('total-recipes').textContent = `${formattedTotal} ${suffix}`;
// Affichage ou non du message d'erreur
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
    clearBtn.classList.remove('hidden'); // Affiche la croix si du texte est saisi
    hideErrorMessage();
  } else {
    clearBtn.classList.add('hidden'); // Masque la croix si l'input est vide
  }
});

// Efface le texte et remet le focus sur l'input après clic sur la croix
document.getElementById('main-clear-search').addEventListener('click', function () {
  const searchInput = document.getElementById('search-input');
  searchInput.value = ''; // Efface le texte de l'input
  this.classList.add('hidden'); // Masque la croix après avoir effacé le texte
  hideErrorMessage();
  searchInput.focus(); // Remet le focus sur l'input après avoir effacé
});

// Initialisation au chargement de la page
window.addEventListener('load', () => {
  displayRecipes(recipes); // Affiche toutes les recettes au départ
  updateAdvancedFilters(recipes); // Met à jour les filtres avec toutes les recettes

  // Ajoute l'écouteur d'événement pour le champ de recherche
  document.getElementById('search-input').addEventListener('input', filterRecipes);

  // Ajout des écouteurs pour les champs de recherche et les filtres avancés
  document.getElementById('ingredients-search').addEventListener('input', () => filterOptions('ingredients-search', 'ingredients'));
  document.getElementById('appareils-search').addEventListener('input', () => filterOptions('appareils-search', 'appareils'));
  document.getElementById('ustensiles-search').addEventListener('input', () => filterOptions('ustensiles-search', 'ustensiles'));

  // Gérer les clics dans les filtres avancés pour la sélection des options
  const filtres = document.querySelectorAll('#ingredients, #appareils, #ustensiles');
  filtres.forEach(filtre => {
    filtre.addEventListener('click', (e) => {
      if (e.target.tagName === 'LI') {
        e.target.classList.toggle('selected'); // Ajoute ou enlève la classe 'selected'
        filterRecipes(); // Filtrer les recettes après modification
        displayTags(); // Afficher les tags sélectionnés
      }
    });
  });
});

//Configuration des filtres Ingrédients, appareils et ustensiles
document.addEventListener('DOMContentLoaded', () => {
  function setupFilter(labelFor, containerId, ulId, inputId, clearBtnId) {
    const label = document.querySelector(`label[for="${labelFor}"]`);
    const inputContainer = document.getElementById(containerId);
    const ul = document.getElementById(ulId);
    const input = document.getElementById(inputId);
    const clearBtn = document.getElementById(clearBtnId);

    let isInputVisible = false; // Gérer l'état d'affichage de l'input
    let placeholderText = input.placeholder; // Stocker le texte initial du placeholder

     // Affiche ou masque le champ de recherche du filtre
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
    ul.addEventListener('click', () => {
      if (ul.value) {
        input.value = ''; // Efface le texte saisi dans l'input
        clearBtn.classList.add('hidden'); // Masque la croix
        isInputVisible = true;
        inputContainer.classList.remove('opacity-0', 'pointer-events-none'); // Garde l'input visible
        label.classList.remove('label-hidden'); // Garde le padding
      }
    });
  }

  // Configuration des filtres
  setupFilter('ingredients-search', 'ingredients-input-container', 'ingredients', 'ingredients-search', 'ingredients-clear-search');
  setupFilter('appareils-search', 'appareils-input-container', 'appareils', 'appareils-search', 'appareils-clear-search');
  setupFilter('ustensiles-search', 'ustensiles-input-container', 'ustensiles', 'ustensiles-search', 'ustensiles-clear-search');
});
