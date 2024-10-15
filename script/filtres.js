import { recipes } from './recipes.js'; // Importe les données des recettes
import { displayRecipes, showErrorMessage, hideErrorMessage, updateRecipeCount } from './index.js'; // Importe des fonctions pour afficher les recettes, gérer les erreurs et mettre à jour le compteur
import { MainfilterRecipes, updateAdvancedFilters } from './main.js';

// Objet pour stocker les tags sélectionnés par catégorie
export const selectedTags = {
  ingredients: [],// Tags d'ingrédients sélectionnés
  appareils: [],// Tags d'appareils sélectionnés
  ustensiles: []// Tags d'ustensiles sélectionnés
};

// Fonction pour afficher les tags dans l'interface
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
      tag.className = 'inline-flex justify-between bg-yellow-400 text-black rounded px-2 py-2 items-center w-44';

      tag.textContent = tagText; // Texte du tag

      const removeIcon = document.createElement('span');
      removeIcon.style.position = 'relative'; // Pour le positionnement correct de l'icône

      // Créer l'élément image
      const img = document.createElement('img');
      img.src = './assets/icone close tag.png'; // Remplacez par le chemin de votre image
      img.alt = 'Supprimer'; // Texte alternatif pour l'accessibilité
      img.style.width = '17px'; // Ajustez la taille selon vos besoins
      img.style.height = '17px'; // Ajustez la taille selon vos besoins
      img.style.display = 'none'; // Cacher l'image par défaut

      // Ajouter un "X" comme texte
      const xText = document.createElement('span');
      xText.textContent = 'X'; // Définit le contenu texte par défaut
      xText.style.fontSize = '17px'; // Ajuste la taille de la police si nécessaire
      xText.classList.add('ml-2', 'cursor-pointer', 'text-black-700', 'text-2xl','z-30'); // Classes Tailwind pour le style

      removeIcon.appendChild(xText); // Ajoute le "X" à l'icône
      removeIcon.appendChild(img); // Ajoute l'image à l'icône

      // Événements de survol
      removeIcon.addEventListener('mouseenter', () => {
          xText.style.display = 'none'; // Cacher le "X"
          img.style.display = 'inline'; // Afficher l'image
      });

      removeIcon.addEventListener('mouseleave', () => {
          xText.style.display = 'inline'; // Afficher le "X"
          img.style.display = 'none'; // Cacher l'image
      });

      // Écouteur d'événement pour supprimer le tag
      removeIcon.addEventListener('click', () => {
        removeTag(tagText, category); // Supprime le tag lorsqu'on clique sur l'icône
        filterRecipesWithAdvancedFilters(); // Refiltre les recettes après la suppression du tag
        MainfilterRecipes();
      });

      tag.appendChild(removeIcon); // Ajoute l'icône au tag
      tagContainer.appendChild(tag); // Ajoute le tag au conteneur
    });
  }
}

// Fonction pour ajouter un tag dans la catégorie correspondante
function addTag(tagText, category) {
  // Met la première lettre en majuscule et met le reste en minuscules
  const capitalizedTag = tagText.charAt(0).toUpperCase() + tagText.slice(1).toLowerCase();

  // Vérifie si le tag n'est pas déjà sélectionné dans la catégorie
  if (selectedTags[category] && !selectedTags[category].some(tag => tag.toLowerCase() === capitalizedTag.toLowerCase())) {
    selectedTags[category].push(capitalizedTag); // Ajoute le tag
    displayTags(); // Affiche les tags mis à jour
    updateFilterOptions(recipes); // Met à jour les options de filtre en fonction des recettes restantes
    MainfilterRecipes();
  }
}

// Fonction pour retirer un tag
// Fonction pour retirer un tag
function removeTag(tagText, category) {
  if (selectedTags[category]) {
    // Vérifie que le tag existe dans la catégorie
    const index = selectedTags[category].indexOf(tagText);
    if (index > -1) {
      selectedTags[category].splice(index, 1); // Supprime le tag
      displayTags(); // Affiche les tags mis à jour
      updateFilterOptions(recipes); // Met à jour les options de filtre

      // Filtre les recettes après la suppression du tag
      MainfilterRecipes(); // Cela mettra à jour le compteur des recettes affichées
    }
  }
}

  


// Mettre à jour les options des filtres avancés (Ingrédients, Appareils, Ustensiles) en fonction des recettes affichées
export function updateFilterOptions(filteredRecipes) {
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
  if (recipe.ingredients) {
    recipe.ingredients.forEach(ingredient => {
      uniqueIngredients.add(ingredient.ingredient.toLowerCase().trim());
    });
  }
  
  if (recipe.appliance) {
    uniqueAppareils.add(recipe.appliance.toLowerCase().trim());
  }
  
  if (recipe.ustensils) {
    recipe.ustensils.forEach(ustensile => {
      uniqueUstensiles.add(ustensile.toLowerCase().trim());
    });
  }
});



// Fonction pour mettre à jour les éléments d'une liste (Ingrédients, Appareils, Ustensiles)
  // Fonction pour mettre à jour les éléments d'une liste (Ingrédients, Appareils, Ustensiles)
function updateListItems(ul, items) {
  ul.innerHTML = ''; // Efface les options existantes
  items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    li.classList.add('cursor-pointer', 'hover:bg-yellow-400', 'py-2', 'px-4', 'list-item'); // Ajout de 'list-item'

    // Ajoute un tag lorsqu'on clique sur un élément de la liste
    li.addEventListener('click', () => {
      const category = ul.id.includes('ingredients') ? 'ingredients' :
                      ul.id.includes('appareils') ? 'appareils' : 'ustensiles';

      // Ajoute le tag dans la catégorie correspondante
      addTag(item, category); 

      // Ajoute la classe de fond jaune
      li.classList.toggle('selected'); // Assurez-vous d'avoir la classe 'selected' qui applique le fond jaune
      
      // Créer l'élément de fermeture uniquement si l'élément est sélectionné
      if (li.classList.contains('selected')) {
        const closeIcon = document.createElement('span');
        closeIcon.textContent = '✖'; // Icône de fermeture
        closeIcon.classList.add('close-icon');

        // Écouteur d'événements pour la fermeture
        closeIcon.addEventListener('click', (e) => {
          e.stopPropagation(); // Empêche le clic sur l'élément de liste
          li.classList.remove('selected'); // Enlève la sélection
          closeIcon.remove(); // Retire l'icône de fermeture
        });

        // Ajouter l'icône de fermeture à l'élément de liste
        li.appendChild(closeIcon);
      } else {
        // Retire l'icône de fermeture si l'élément n'est plus sélectionné
        const closeIcon = li.querySelector('.close-icon');
        if (closeIcon) {
          closeIcon.remove();
        }
      }

      // Appel des fonctions de filtrage et d'affichage des tags
      MainfilterRecipes(); // Remplacez par votre logique de filtrage
      displayTags(); // Remplacez par votre logique d'affichage des tags
    });

    ul.appendChild(li); // Ajoute l'élément de la liste
  });
}
  updateListItems(ingredientsList, [...uniqueIngredients]);// Met à jour la liste des ingrédients
  updateListItems(appareilsList, [...uniqueAppareils]);// Met à jour la liste des appareils
  updateListItems(ustensilesList, [...uniqueUstensiles]);// Met à jour la liste des ustensiles
  
}

// Fonction pour masquer les recettes
function hideRecipes() {
  const recipeContainer = document.getElementById('results-container');
  if (recipeContainer) {
    recipeContainer.innerHTML = ''; // Efface les recettes affichées
  }
}
export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
// Récupère les tags sélectionnés avec la première lettre en majuscule et trie par ordre alphabétique
const selectedIngredients = selectedTags.ingredients
  .map(tag => capitalizeFirstLetter(tag))
  .sort();
  const selectedAppareils = selectedTags.appareils
  .map(tag => capitalizeFirstLetter(tag))
  .sort();

const selectedUstensiles = selectedTags.ustensiles
  .map(tag => capitalizeFirstLetter(tag))
  .sort();


// Fonction de filtrage des recettes avec les filtres avancés (tags)
// Fonction de filtrage des recettes avec les filtres avancés (tags)
export function filterRecipesWithAdvancedFilters() {
  // Vérifiez que l'élément existe avant d'accéder à sa valeur
  const ingredientInput = document.getElementById('ingredients-search');
  const appareilInput = document.getElementById('appareils-search');
  const ustensileInput = document.getElementById('ustensiles-search');

  // Déclaration des valeurs après avoir récupéré les éléments
  const ingredientValue = ingredientInput ? ingredientInput.value.trim().toLowerCase() : '';
  const appareilValue = appareilInput ? appareilInput.value.trim().toLowerCase() : '';
  const ustensileValue = ustensileInput ? ustensileInput.value.trim().toLowerCase() : '';

  // Récupérer le texte de recherche principal
  const searchInputElement = document.getElementById('main-search-input'); // Assurez-vous que l'ID est correct
  const searchText = searchInputElement ? searchInputElement.value.toLowerCase() : ''; // Vérifiez si l'élément existe

  // Ajoutez un console log pour vérifier si l'élément est récupéré correctement
  console.log('Champ de recherche principal:', searchInputElement); // Vérifiez l'élément
  console.log('Texte de recherche principal:', searchText); // Vérifiez la valeur

  // Récupère les tags avec la première lettre en majuscule et le reste en minuscule
  const selectedIngredients = selectedTags.ingredients.map(tag => capitalizeFirstLetter(tag));
  const selectedAppareils = selectedTags.appareils.map(tag => capitalizeFirstLetter(tag));
  const selectedUstensiles = selectedTags.ustensiles.map(tag => capitalizeFirstLetter(tag));

  // Vérifiez si tous les filtres sont vides
  const isAllEmpty = selectedIngredients.length === 0 && selectedAppareils.length === 0 && selectedUstensiles.length === 0 && !searchText;

  // Si aucun tag et aucun texte de recherche, afficher toutes les recettes
  if (isAllEmpty) {
    displayRecipes(recipes); // Affiche toutes les recettes
    updateRecipeCount(1500); // Met à jour le compteur avec 1500
    return; // Quitte la fonction
  }

  // Filtre les recettes en fonction des tags et du texte de recherche
  const filteredRecipes = recipes.filter(recipe => {
    const matchesIngredients = selectedIngredients.length === 0 || 
      selectedIngredients.every(tag => 
        recipe.ingredients.some(ingredient => 
          ingredient.ingredient.toLowerCase().includes(tag.toLowerCase())
        )
      );

    const matchesAppareils = selectedAppareils.length === 0 || 
      selectedAppareils.includes(recipe.appliance?.toLowerCase() || '');

    const matchesUstensiles = selectedUstensiles.length === 0 || 
      recipe.ustensils?.some(ustensile => 
        selectedUstensiles.includes(ustensile.toLowerCase())
      ) || false;

    const matchesSearchText = searchText === '' || 
      recipe.name.toLowerCase().includes(searchText) || 
      recipe.ingredients.some(ingredient => 
        ingredient.ingredient.toLowerCase().includes(searchText)
      ) || 
      recipe.description.toLowerCase().includes(searchText);

    return matchesIngredients && matchesAppareils && matchesUstensiles && matchesSearchText;
  });

  // Affiche les recettes filtrées
  displayRecipes(filteredRecipes);
  updateRecipeCount(filteredRecipes.length); // Met à jour le compteur de recettes

  // Gère l'affichage des recettes et des messages d'erreur
  if (filteredRecipes.length === 0) {
    hideRecipes(); // Cache les recettes
    showErrorMessage(); // Affiche un message d'erreur si aucune recette ne correspond
  } else {
    hideErrorMessage(); // Cache le message d'erreur
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
        const selectedOption = event.target.closest('li'); // Récupère l'élément li cliqué
        if (selectedOption) {
          const category = filter.id; // Utilise l'ID du UL pour déterminer la catégorie
          addTag(selectedOption.dataset.value, category); // Ajoute le tag correspondant
        }
      });
    }
  });
}

// Assurez-vous d'appeler cette fonction après l'initialisation des options de filtre
updateAdvancedFilters(recipes); // Appelez cette fonction pour initialiser les filtres
listenToFilterChanges(); // Ajoutez les écouteurs d'événements après l'initialisation

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
      arrow.innerHTML = '<img src="./assets/flèche-montante.png" alt="Flèche vers le haut" class="w-4 h-4 ml-10 inline-block">';
    } else {
      dropdown.classList.add('hidden');
      arrow.innerHTML = '<img src="./assets/flèche-descendante.png" alt="Flèche vers le bas" class="w-4 h-4 ml-10 inline-block">';
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


// Écouteurs pour la recherche en temps réel sur les trois filtres
document.getElementById('ingredients-search').addEventListener('input', MainfilterRecipes);
document.getElementById('appareils-search').addEventListener('input', MainfilterRecipes);
document.getElementById('ustensiles-search').addEventListener('input', MainfilterRecipes);




