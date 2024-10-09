import { recipes } from './recipes.js'; // Importe les données des recettes
import { displayRecipes, showErrorMessage, hideErrorMessage, updateRecipeCount } from './index.js'; // Importe des fonctions pour afficher les recettes, gérer les erreurs et mettre à jour le compteur
import { updateAdvancedFilters } from './main.js';

// Objet pour stocker les tags sélectionnés par catégorie
const selectedTags = {
  ingredients: [],// Tags d'ingrédients sélectionnés
  appareils: [],// Tags d'appareils sélectionnés
  ustensiles: []// Tags d'ustensiles sélectionnés
};

// Fonction pour afficher les tags dans l'interface
export function displayTags() {
  const tagContainer = document.getElementById('tag-container');
  if (!tagContainer) {
    console.error('Élément #tag-container non trouvé');
    return;
  }

  tagContainer.innerHTML = ''; // Efface les tags existants

  // Affiche chaque catégorie de tags (ingrédients, appareils, ustensiles)
  for (const [category, tagsArray] of Object.entries(selectedTags)) {
    tagsArray.forEach(tagText => {
      const tag = document.createElement('span');
      tag.className = 'inline-flex justify-between bg-yellow-400 text-black rounded px-2 py-2 items-center w-52';

      tag.textContent = tagText;// Texte du tag

      const removeIcon = document.createElement('span');
      removeIcon.textContent = 'x';// Icône pour supprimer le tag
      removeIcon.classList.add('ml-2', 'cursor-pointer', 'hover:text-black-700', 'text-2xl'); // Ajout d'une couleur au survol

      tag.appendChild(removeIcon);// Ajoute l'icône au tag

      // Écouteur d'événement pour supprimer le tag
      removeIcon.addEventListener('click', () => {
        removeTag(tagText, category);// Supprime le tag lorsqu'on clique sur l'icône
        filterRecipesWithAdvancedFilters();// Refiltre les recettes après la suppression du tag
      });

      tagContainer.appendChild(tag);// Ajoute le tag au conteneur
    });
  }
}

// Fonction pour ajouter un tag dans la catégorie correspondante
function addTag(tagText, category) {
  // Vérifie si le tag n'est pas déjà sélectionné dans la catégorie
  if (selectedTags[category] && !selectedTags[category].includes(tagText)) {
    selectedTags[category].push(tagText);// Ajoute le tag
    displayTags(); //Affiche les tags mis à jour
    filterRecipesWithAdvancedFilters(); // Filtre les recettes avec les nouveaux tags
    updateFilterOptions(recipes); // Met à jour les options de filtre en fonction des recettes restantes
    MainfilterRecipes();
  }
}

// Fonction pour retirer un tag
function removeTag(tagText, category) {
  if (selectedTags[category]) {
    // Vérifie que le tag existe dans la catégorie
    const index = selectedTags[category].indexOf(tagText);
    if (index > -1) {
      selectedTags[category].splice(index, 1);// Supprime le tag
      displayTags(); // Affiche les tags mis à jour
      filterRecipesWithAdvancedFilters(); // Filtre les recettes après la suppression du tag
      updateFilterOptions(recipes); // Met à jour les options de filtre
      MainfilterRecipes();
    }
  }
}

// Mettre à jour les options des filtres avancés (Ingrédients, Appareils, Ustensiles) en fonction des recettes affichées
function updateFilterOptions(filteredRecipes) {
  const ingredientsList = document.getElementById('ingredients-search');
  const appareilsList = document.getElementById('appareils-search');
  const ustensilesList = document.getElementById('ustensiles-search');

  if (!ingredientsList || !appareilsList || !ustensilesList) {
    console.error('Un ou plusieurs éléments de filtre non trouvés');
    return;
  }

  const uniqueIngredients = new Set();
  const uniqueAppareils = new Set();
  const uniqueUstensiles = new Set();

// Collecte des ingrédients, appareils et ustensiles uniques à partir des recettes filtrées
  filteredRecipes.forEach(recipe => {
    recipe.ingredients.forEach(ingredient => uniqueIngredients.add(ingredient.ingredient));
    if (recipe.appliance) uniqueAppareils.add(recipe.appliance);
    recipe.ustensils.forEach(ustensile => uniqueUstensiles.add(ustensile));
  });

// Fonction pour mettre à jour les éléments d'une liste (Ingrédients, Appareils, Ustensiles)
  function updateListItems(ul, items) {
    ul.innerHTML = '';// Efface les options existantes
    items.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      li.classList.add('cursor-pointer', 'hover:bg-yellow-400', 'py-2', 'px-4');// Style des éléments de la liste
  
      // Ajoute un tag lorsqu'on clique sur un élément de la liste
      li.addEventListener('click', () => {
        const category = ul.id.includes('ingredients') ? 'ingredients' :
                        ul.id.includes('appareils') ? 'appareils' : 'ustensiles';
        addTag(item, category); // Ajoute le tag dans la catégorie correspondante
      });
  
      ul.appendChild(li);// Ajoute l'élément de la liste
    });
  }
  
  updateListItems(ingredientsList, [...uniqueIngredients]);// Met à jour la liste des ingrédients
  updateListItems(appareilsList, [...uniqueAppareils]);// Met à jour la liste des appareils
  updateListItems(ustensilesList, [...uniqueUstensiles]);// Met à jour la liste des ustensiles
  
}

// Fonction de filtrage des recettes avec les filtres avancés (tags)
function filterRecipesWithAdvancedFilters() {
   // Récupère les tags sélectionnés en minuscule
  const selectedIngredients = selectedTags.ingredients.map(tag => tag.toLowerCase());
  const selectedAppareils = selectedTags.appareils.map(tag => tag.toLowerCase());
  const selectedUstensiles = selectedTags.ustensiles.map(tag => tag.toLowerCase());

  // Filtre les recettes en fonction des tags sélectionnés
  const filteredRecipes = recipes.filter(recipe => {
    const matchesIngredients = selectedIngredients.length === 0 ||
      recipe.ingredients.some(ingredient => 
        selectedIngredients.includes(ingredient.ingredient.toLowerCase())
        
      );

    const matchesAppareils = selectedAppareils.length === 0 ||
      selectedAppareils.includes(recipe.appliance?.toLowerCase() || '');

    const matchesUstensiles = selectedUstensiles.length === 0 ||
      recipe.ustensils?.some(ustensile => 
        selectedUstensiles.includes(ustensile.toLowerCase())
      ) || false;

    return matchesIngredients && matchesAppareils && matchesUstensiles;
  });

  updateRecipeCount(filteredRecipes.length); // Met à jour le compteur de recettes
   // Gère l'affichage des recettes et des messages d'erreur
  if (filteredRecipes.length === 0) {
    hideRecipes(); // Cache les recettes
    showErrorMessage();// Affiche un message d'erreur si aucune recette ne correspond
  } else {
    hideErrorMessage();// Cache le message d'erreur
    displayRecipes(filteredRecipes); // Affiche les recettes filtrées
    updateFilterOptions(filteredRecipes); // Met à jour les options des filtres avec les recettes filtrées
  }

  
 
  
}

// Ajouter des écouteurs d'événements pour les filtres avancés
function listenToFilterChanges() {
  const filters = document.querySelectorAll('#ingredients, #appareils, #ustensiles');
  filters.forEach(filter => {
    if (filter) {
      filter.addEventListener('click', event => {
        const category = event.target.closest('ul').id; // Récupère la catégorie depuis l'ID du UL
        const selectedOption = event.target.textContent;// Récupère l'option sélectionnée
        if (selectedOption) {
          addTag(selectedOption, category);// Ajoute le tag correspondant
        }
      });
    }
  });
}

// Initialisation des filtres lors du chargement de la page
window.addEventListener('load', () => {
  updateFilterOptions(recipes); // Met à jour les options des filtres avec toutes les recettes initiales les recettes initiales
  listenToFilterChanges();// Ajoute les écouteurs d'événements pour les filtres
 
});

document.addEventListener("DOMContentLoaded", function() {

// Gère l'ouverture et la fermeture des listes déroulantes pour les filtres
  function toggleDropdown(dropdownId, label) {
    const dropdown = document.getElementById(dropdownId);
    const arrow = label.querySelector('.arrow');// Sélectionne l'icône de la flèche

    
    if (!dropdown) {
      console.error(`Dropdown avec l'ID ${dropdownId} non trouvé.`);
      return;
    }
// Alterne entre affichage et masquage du dropdown
    if (dropdown.classList.contains('hidden')) {
      dropdown.classList.remove('hidden');
      arrow.innerHTML = '<img src="./assets/flèche-montante.png" alt="Flèche vers le haut" class="w-4 h-4 inline-block">';
    } else {
      dropdown.classList.add('hidden');
      arrow.innerHTML = '<img src="./assets/flèche-descendante.png" alt="Flèche vers le bas" class="w-4 h-4 inline-block">';
    }
  }

  const filters = [
    { id: 'ingredients', label: 'Ingrédients' },
    { id: 'appareils', label: 'Appareils' },
    { id: 'ustensiles', label: 'Ustensiles' },
  ];
// Ajoute des écouteurs d'événements pour les labels des filtres
  filters.forEach(filter => {
    const label = document.querySelector(`label[for="${filter.id}-search"]`); // Ajustement ici pour utiliser -search
    if (label) {
      label.addEventListener('click', function() {
        toggleDropdown(filter.id, label);
      });
    } else {
      console.warn(`Label pour ${filter.id} non trouvé.`);
    }
  });
});

// Fonction de filtrage des recettes
// Fonction de filtrage des recettes
 // Fonction de filtrage des recettes
function MainfilterRecipes() {
  const MainsearchInput = document.getElementById('main-search-input');
  const MainsearchText = MainsearchInput.value.trim().toLowerCase();

  // Récupération des tags sélectionnés dans chaque filtre
  const selectedIngredients = Array.from(document.querySelectorAll('#ingredients li.selected')).map(li => li.dataset.value.toLowerCase());
  const selectedAppareils = Array.from(document.querySelectorAll('#appareils li.selected')).map(li => li.dataset.value.toLowerCase());
  const selectedUstensiles = Array.from(document.querySelectorAll('#ustensiles li.selected')).map(li => li.dataset.value.toLowerCase());

  // Si moins de 3 caractères dans la barre de recherche ET aucun tag sélectionné, ne rien faire
  if (MainsearchText.length < 3 && selectedIngredients.length === 0 && selectedAppareils.length === 0 && selectedUstensiles.length === 0) {
    hideErrorMessage(); // Masque le message d'erreur si la recherche est trop courte
    updateRecipeCount(0); // Réinitialise le compteur
    displayRecipes([]); // Affiche un tableau vide
    return;
  }

  // Filtrage des recettes
  const recettesFiltrees = recipes.filter(recette => {
    // Vérifier si la recette correspond au texte de recherche OU s'il n'y a pas de recherche texte
    const correspondTexte = MainsearchText === '' || recette.name.toLowerCase().includes(MainsearchText) ||
                            recette.description.toLowerCase().includes(MainsearchText) ||
                            recette.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(MainsearchText));

    // Vérifier si la recette correspond aux ingrédients sélectionnés (intersection)
    const correspondIngredients = selectedIngredients.length === 0 || 
      selectedIngredients.every(selected => 
        recette.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes (selected))
      );

    // Vérifier si la recette correspond aux appareils sélectionnés
    const correspondAppareils = selectedAppareils.length === 0 || 
    selectedAppareils.some(selected => recette.appliance?.toLowerCase().includes(selected));

    // Vérifier si la recette correspond aux ustensiles sélectionnés
    const correspondUstensiles = selectedUstensiles.length === 0 || 
      recette.ustensils?.some(ustensile => selectedUstensiles.some(selected => ustensile.toLowerCase().includes(selected))) || false;

    // Retourner vrai si la recette correspond à tous les critères
    return correspondTexte && correspondIngredients && correspondAppareils && correspondUstensiles;
  });

  // Mettez à jour l'affichage des recettes filtrées
  displayRecipes(recettesFiltrees);
  updateRecipeCount(recettesFiltrees.length);

  

  // Gérer l'affichage du message d'erreur
  if (recettesFiltrees.length === 0) { // Vérifier le nombre de recettes filtrées
    showErrorMessage(MainsearchText); // Montre un message d'erreur si aucune recette ne correspond
  } else {
    hideErrorMessage(); // Masque le message d'erreur si des recettes sont trouvées
  }
}

// Écouteurs pour la recherche en temps réel sur les trois filtres
document.getElementById('ingredients-search').addEventListener('input', MainfilterRecipes);
document.getElementById('appareils-search').addEventListener('input', MainfilterRecipes);
document.getElementById('ustensiles-search').addEventListener('input', MainfilterRecipes);

// Fonction pour gérer le clic sur un élément de la liste
// Fonction pour gérer le clic sur un élément de la liste
function handleListItemClick(event) {
  const listItem = event.target;

  // Vérifie si l'élément cliqué est un item de liste
  if (listItem.classList.contains('list-item')) {
      // Vérifie si l'élément est déjà sélectionné
      if (!listItem.classList.contains('bg-yellow-custom')) {
          // Ajouter la classe de fond jaune
          listItem.classList.add('bg-yellow-custom');

          // Créer l'élément de fermeture
          const closeIcon = document.createElement('span');
          closeIcon.textContent = '✖'; // Ou une autre icône de fermeture
          closeIcon.classList.add('close-icon');

          // Écouteur d'événements pour la fermeture
          closeIcon.addEventListener('click', (e) => {
              e.stopPropagation(); // Empêche le clic sur l'élément de liste
              listItem.classList.remove('bg-yellow-custom'); // Enlève la sélection
              closeIcon.remove(); // Retire l'icône de fermeture
          });

          // Ajouter l'icône de fermeture à l'élément de liste
          listItem.appendChild(closeIcon);
      }
  }
}

// Ajouter des écouteurs d'événements sur tous les éléments de la liste
const listItems = document.querySelectorAll('.list-item');
listItems.forEach(item => {
  item.addEventListener('click', handleListItemClick);
 
});
