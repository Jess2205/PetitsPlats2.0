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
      const tag = document.createElement('span');
      tag.className = 'inline-flex justify-between bg-yellow-400 text-black rounded px-2 py-2 items-center w-52'; // inline-flex pour que le contenu s'ajuste

      tag.textContent = tagText;

      const removeIcon = document.createElement('span');
      removeIcon.textContent = 'x';
      removeIcon.classList.add('ml-2', 'cursor-pointer', 'hover:text-black-700-rounded', 'text-2xl'); // Ajout d'une couleur au survol

      tag.appendChild(removeIcon);

      // Event listener pour supprimer le tag
      removeIcon.addEventListener('click', () => {
        removeTag(tagText, category);
        filterRecipesWithAdvancedFilters(); // Refiltre les recettes après suppression du tag
        displayTags(); // Met à jour l'affichage des tags après la suppression
        
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

// Mettre à jour les options des filtres avancés en fonction des recettes affichées
function updateFilterOptions(filteredRecipes) {
  const ingredientsList = document.getElementById('ingredients');
  const appareilsList = document.getElementById('appareils');
  const ustensilesList = document.getElementById('ustensiles');

  if (!ingredientsList || !appareilsList || !ustensilesList) {
    console.error('Un ou plusieurs éléments de filtre non trouvés');
    return;
  }

  const uniqueIngredients = new Set();
  const uniqueAppareils = new Set();
  const uniqueUstensiles = new Set();

  filteredRecipes.forEach(recipe => {
    recipe.ingredients.forEach(ingredient => uniqueIngredients.add(ingredient.ingredient));
    if (recipe.appliance) uniqueAppareils.add(recipe.appliance);
    recipe.ustensils.forEach(ustensile => uniqueUstensiles.add(ustensile));
  });

  const updateListItems = (ulElement, items) => {
    ulElement.innerHTML = '';
    items.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      li.classList.add('cursor-pointer', 'hover:bg-yellow-300', 'py-2', 'px-4');

      // Ajouter un tag lorsqu'un élément de la liste est cliqué
      li.addEventListener('click', () => {
        addTag(item, ulElement.id); // Utilise l'ID pour retrouver la catégorie
      });

      ulElement.appendChild(li);
      
    });
  };

  updateListItems(ingredientsList, [...uniqueIngredients]);
  updateListItems(appareilsList, [...uniqueAppareils]);
  updateListItems(ustensilesList, [...uniqueUstensiles]);

  
}

// Filtrage des recettes avec les filtres avancés (Ingrédients, Appareils, Ustensiles)
function filterRecipesWithAdvancedFilters() {
  const selectedIngredients = selectedTags.ingredients.map(tag => tag.toLowerCase());
  const selectedAppareils = selectedTags.appareils.map(tag => tag.toLowerCase());
  const selectedUstensiles = selectedTags.ustensiles.map(tag => tag.toLowerCase());

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
  
  

  if (filteredRecipes.length === 0) {
    hideRecipes(); // Cacher les recettes si aucune recette ne correspond
    showErrorMessage(); 
  } else {
    hideErrorMessage();
    displayRecipes(filteredRecipes); // Utilise displayRecipes pour afficher les recettes filtrées
    updateFilterOptions(filteredRecipes); // Met à jour les options des filtres avancés avec les recettes filtrées
    
    
  }
}

// Ajouter des écouteurs d'événements pour les filtres
function listenToFilterChanges() {
  const filters = document.querySelectorAll('#ingredients, #appareils, #ustensiles');
  filters.forEach(filter => {
    if (filter) {
      filter.addEventListener('click', event => {
        const category = event.target.closest('ul').id; // Utilise l'ID du UL comme catégorie
        const selectedOption = event.target.textContent;
        if (selectedOption) {
          addTag(selectedOption, category);
        }
      });
    }
  });
}

// Initialisation des filtres lors du chargement de la page
window.addEventListener('load', () => {
  updateFilterOptions(recipes); // Met à jour les options des filtres avancés avec toutes les recettes initiales
  listenToFilterChanges();
  
});

// Toggle des dropdowns pour les listes d'ingrédients, appareils et ustensiles
document.addEventListener("DOMContentLoaded", function() {
  function toggleDropdown(dropdownId, label) {
    const dropdown = document.getElementById(dropdownId);
    const arrow = label.querySelector('.arrow');
    const container = label.closest('.relative');

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

  filters.forEach(filter => {
    const label = document.querySelector(`label[for="${filter.id}"]`);
    label.addEventListener('click', function() {
      toggleDropdown(filter.id, label);
      
      
    });
  });
});


function filterRecipes() {
  const ingredientSearchText = document.getElementById('ingredients-search').value.toLowerCase();
  const applianceSearchText = document.getElementById('appareils-search').value.toLowerCase();
  const utensilSearchText = document.getElementById('ustensiles-search').value.toLowerCase();

  // Filtre les recettes
  const filteredRecipes = recipes.filter(recipe => {
    const matchesIngredients = ingredientSearchText === '' || recipe.ingredients.some(ingredient =>
      ingredient.ingredient.toLowerCase().includes(ingredientSearchText)
    );

    const matchesAppareils = applianceSearchText === '' || recipe.appliance.toLowerCase().includes(applianceSearchText);

    const matchesUstensiles = utensilSearchText === '' || recipe.ustensils.some(utensil =>
      utensil.toLowerCase().includes(utensilSearchText)
    );

    return matchesIngredients && matchesAppareils && matchesUstensiles;
  });

  // Affiche les recettes filtrées
  console.log(filteredRecipes); // Log pour voir les recettes filtrées
  displayRecipes(filteredRecipes);

  // Met à jour le compteur
  updateRecipeCount(filteredRecipes.length);

  // Gérer l'affichage des messages d'erreur
  if (filteredRecipes.length === 0) {
    hideRecipes();
    showErrorMessage();
  } else {
    hideErrorMessage();
  }

  // Met à jour les options des filtres avancés
  updateFilterOptions(filteredRecipes);
}

// Écouteurs pour la recherche en temps réel sur les trois filtres
document.getElementById('ingredients-search').addEventListener('input', filterRecipes);
document.getElementById('appareils-search').addEventListener('input', filterRecipes);
document.getElementById('ustensiles-search').addEventListener('input', filterRecipes);

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
