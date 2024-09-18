import { recipes } from './recipes.js'; // Assurez-vous que le chemin est correct
import { displayRecipes, showErrorMessage, hideErrorMessage, updateRecipeCount } from './index.js'; // Assurez-vous que le chemin est correct

// Objet pour stocker les tags sélectionnés
const selectedTags = {
  ingredients: [],
  appareils: [],
  ustensiles: []
};

// Fonction pour afficher les tags dans le conteneur
function displayTags() {
  const tagContainer = document.getElementById('tag-container');
  if (!tagContainer) {
    console.error('Élément #tag-container non trouvé');
    return;
  }

  tagContainer.innerHTML = ''; // Efface les tags existants

  for (const [category, tagsArray] of Object.entries(selectedTags)) {
    tagsArray.forEach(tagText => {
      const tag = document.createElement('div');
      tag.className = 'tag bg-yellow-400 text-black rounded px-3 py-1 mr-2 mb-2 inline-block';
      tag.textContent = tagText;

      const removeIcon = document.createElement('span');
      removeIcon.textContent = '✖';
      removeIcon.classList.add('ml-2', 'cursor-pointer');
      tag.appendChild(removeIcon);

      removeIcon.addEventListener('click', () => {
        removeTag(tagText, category);
        filterRecipesWithAdvancedFilters(); // Refiltre les recettes après suppression du tag
      });

      tagContainer.appendChild(tag);
    });
  }
}

// Fonction pour ajouter un tag dans la catégorie correspondante
function addTag(tagText, category) {
  if (selectedTags[category] && !selectedTags[category].includes(tagText)) {
    selectedTags[category].push(tagText);
    displayTags(); // Affiche les tags sélectionnés
    filterRecipesWithAdvancedFilters(); // Met à jour les recettes avec les filtres avancés
  }
}


// Fonction pour retirer un tag
function removeTag(tagText, category) {
  if (selectedTags[category]) {
    const index = selectedTags[category].indexOf(tagText);
    if (index > -1) {
      selectedTags[category].splice(index, 1);
      displayTags(); // Re-affiche les tags
    }
  }
}

function updateFilterOptions(filteredRecipes) {
  const ingredientsSelect = document.getElementById('ingredients');
  const appareilsSelect = document.getElementById('appareils');
  const ustensilesSelect = document.getElementById('ustensiles');

  if (!ingredientsSelect || !appareilsSelect || !ustensilesSelect) {
    console.error('Un ou plusieurs éléments de filtre non trouvés');
    return;
  }

  // Utiliser des tableaux pour stocker les options uniques
  let uniqueIngredients = [];
  let uniqueAppareils = [];
  let uniqueUstensiles = [];

  // Boucle sur les recettes filtrées
  for (let i = 0; i < filteredRecipes.length; i++) {
    const recipe = filteredRecipes[i];

    // Boucle sur les ingrédients de chaque recette
    for (let j = 0; j < recipe.ingredients.length; j++) {
      const ingredient = recipe.ingredients[j].ingredient;
      // Ajout de l'ingrédient s'il n'existe pas déjà dans le tableau
      if (uniqueIngredients.indexOf(ingredient) === -1) {
        uniqueIngredients.push(ingredient);
      }
    }

    // Ajout de l'appareil si non déjà présent
    if (recipe.appliance && uniqueAppareils.indexOf(recipe.appliance) === -1) {
      uniqueAppareils.push(recipe.appliance);
    }

    // Boucle sur les ustensiles
    for (let k = 0; k < recipe.ustensils.length; k++) {
      const ustensile = recipe.ustensils[k];
      // Ajout de l'ustensile s'il n'existe pas déjà dans le tableau
      if (uniqueUstensiles.indexOf(ustensile) === -1) {
        uniqueUstensiles.push(ustensile);
      }
    }
  }

  // Fonction pour mettre à jour les options dans le select
  const updateOptions = (selectElement, items) => {
    // Réinitialiser les options
    selectElement.innerHTML = '<option value="">Tous</option>';
    // Boucle pour ajouter chaque élément comme option
    for (let i = 0; i < items.length; i++) {
      const option = document.createElement('option');
      option.value = items[i];
      option.textContent = items[i];
      selectElement.appendChild(option);
    }
  };

  // Mise à jour des options pour chaque filtre
  updateOptions(ingredientsSelect, uniqueIngredients);
  updateOptions(appareilsSelect, uniqueAppareils);
  updateOptions(ustensilesSelect, uniqueUstensiles);
}

function filterRecipesWithAdvancedFilters() {
  // Utilisation d'une boucle pour convertir les tags sélectionnés en minuscules
  let selectedIngredients = [];
  let selectedAppareils = [];
  let selectedUstensiles = [];

  for (let i = 0; i < selectedTags.ingredients.length; i++) {
    selectedIngredients.push(selectedTags.ingredients[i].toLowerCase());
  }

  for (let i = 0; i < selectedTags.appareils.length; i++) {
    selectedAppareils.push(selectedTags.appareils[i].toLowerCase());
  }

  for (let i = 0; i < selectedTags.ustensiles.length; i++) {
    selectedUstensiles.push(selectedTags.ustensiles[i].toLowerCase());
  }

  // Création d'un tableau pour stocker les recettes filtrées
  let filteredRecipes = [];

  // Boucle pour filtrer chaque recette
  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];

    // Vérification des ingrédients
    let matchesIngredients = (selectedIngredients.length === 0);
    for (let j = 0; j < recipe.ingredients.length; j++) {
      const ingredient = recipe.ingredients[j].ingredient.toLowerCase();
      if (selectedIngredients.indexOf(ingredient) !== -1) {
        matchesIngredients = true;
        break; // Arrête la boucle dès qu'un ingrédient correspond
      }
    }

    // Vérification des appareils
    let matchesAppareils = (selectedAppareils.length === 0) || 
      (selectedAppareils.indexOf(recipe.appliance?.toLowerCase() || '') !== -1);

    // Vérification des ustensiles
    let matchesUstensiles = (selectedUstensiles.length === 0);
    for (let k = 0; k < recipe.ustensils.length; k++) {
      const ustensile = recipe.ustensils[k].toLowerCase();
      if (selectedUstensiles.indexOf(ustensile) !== -1) {
        matchesUstensiles = true;
        break; // Arrête la boucle dès qu'un ustensile correspond
      }
    }

    // Si tous les critères correspondent, ajouter la recette au tableau filtré
    if (matchesIngredients && matchesAppareils && matchesUstensiles) {
      filteredRecipes.push(recipe);
    }
  }

  // Mise à jour du nombre de recettes filtrées
  updateRecipeCount(filteredRecipes.length);

  // Afficher ou cacher les résultats selon le nombre de recettes filtrées
  if (filteredRecipes.length === 0) {
    hideRecipes(); // Cacher les recettes si aucune ne correspond
    showErrorMessage(searchText); // Afficher un message d'erreur avec searchText
  } else {
    hideErrorMessage();
    displayRecipes(filteredRecipes); // Afficher les recettes filtrées
    updateFilterOptions(filteredRecipes); // Mettre à jour les filtres avancés
  }
}


// Fonction de filtrage des recettes
function filterRecipes() {
  const searchInput = document.getElementById('search-input');
  const searchText = searchInput.value.trim().toLowerCase();

  // Récupérer les tags d'ingrédients, d'ustensiles, et d'appareils sélectionnés
  const selectedIngredients = [...document.querySelectorAll('#ingredients option:checked')].map(el => el.value.toLowerCase());
  const selectedUstensils = [...document.querySelectorAll('#ustensiles option:checked')].map(el => el.value.toLowerCase());
  const selectedAppliances = [...document.querySelectorAll('#appareils option:checked')].map(el => el.value.toLowerCase());

  // Filtrer les recettes selon le texte et les tags
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearchText = (
      recipe.name.toLowerCase().includes(searchText) ||
      recipe.description.toLowerCase().includes(searchText) ||
      recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchText))
    );

    // Vérifier que la recette contient tous les ingrédients sélectionnés
let matchesIngredients = true;
for (let i = 0; i < selectedIngredients.length; i++) {
  const tag = selectedIngredients[i];
  let ingredientFound = false;
  
  // Parcourir les ingrédients de la recette
  for (let j = 0; j < recipe.ingredients.length; j++) {
    const ingredient = recipe.ingredients[j].ingredient.toLowerCase();
    
    // Si l'ingrédient contient le tag, le marquer comme trouvé
    if (ingredient.includes(tag)) {
      ingredientFound = true;
      break; // Arrêter la boucle si un ingrédient correspondant est trouvé
    }
  }
  
  // Si l'un des tags n'est pas trouvé dans les ingrédients de la recette
  if (!ingredientFound) {
    matchesIngredients = false;
    break; // Arrêter la vérification dès qu'un ingrédient est manquant
  }
}

// Vérifier que la recette contient tous les ustensiles sélectionnés
let matchesUstensils = true;
for (let i = 0; i < selectedUstensils.length; i++) {
  const tag = selectedUstensils[i];
  let ustensilFound = false;
  
  // Parcourir les ustensiles de la recette
  for (let j = 0; j < recipe.ustensils.length; j++) {
    const ustensil = recipe.ustensils[j].toLowerCase();
    
    // Si l'ustensile contient le tag, le marquer comme trouvé
    if (ustensil.includes(tag)) {
      ustensilFound = true;
      break; // Arrêter la boucle si un ustensile correspondant est trouvé
    }
  }
  
  // Si l'un des tags n'est pas trouvé dans les ustensiles de la recette
  if (!ustensilFound) {
    matchesUstensils = false;
    break; // Arrêter la vérification dès qu'un ustensile est manquant
  }
}

    // Vérifier que la recette utilise l'appareil sélectionné
    const matchesAppliance = selectedAppliances.length === 0 || selectedAppliances.includes(recipe.appliance.toLowerCase());

    // Retourner vrai seulement si tous les critères sont remplis (intersection des résultats)
    return matchesSearchText && matchesIngredients && matchesUstensils && matchesAppliance;
  });

  // Afficher ou masquer les résultats en fonction des recettes filtrées
  if (filteredRecipes.length === 0) {
    showErrorMessage(searchText);
  } else {
    hideErrorMessage();
    displayRecipes(filteredRecipes);
  }
}

function listenToFilterChanges() {
  const filters = document.querySelectorAll('#ingredients, #appareils, #ustensiles');

  // Boucle native pour parcourir la NodeList des filtres
  for (let i = 0; i < filters.length; i++) {
    const filter = filters[i];
    
    if (filter) {
      filter.addEventListener('change', function(event) {
        const category = event.target.id;
        const selectedOption = event.target.value;

        // Si une option est sélectionnée, ajouter un tag correspondant
        if (selectedOption) {
          addTag(selectedOption, category);
        }
      });
    }
  }
}

// Initialisation des filtres lors du chargement de la page
window.addEventListener('load', () => {
  updateFilterOptions(recipes); // Met à jour les options des filtres avancés avec toutes les recettes initiales
  listenToFilterChanges();
});
