//Gère la logique des filtres avancés et
//leur interaction avec la recherche principale.

import { recipes } from './recipes.js'; // Importe les données des recettes
import { displayRecipes, showErrorMessage, hideErrorMessage, updateRecipeCount, capitalizeFirstLetter } from './index.js'; // Importe des fonctions pour afficher les recettes, gérer les erreurs et mettre à jour le compteur
import { MainfilterRecipes, escapeHtml} from './main.js'; // Import de la fonction principale de filtrage depuis main.js


// Objet pour stocker les tags sélectionnés par catégorie
// Objet pour stocker les tags sélectionnés par catégorie
export const selectedTags = {
  ingredients: [], // Tags d'ingrédients sélectionnés
  appareils: [], // Tags d'appareils sélectionnés
  ustensiles: [] // Tags d'ustensiles sélectionnés
};

// Fonction pour afficher les tags dans l'interface utilisateur
export function displayTags() {
  const tagContainer = document.getElementById('tag-container'); // Sélectionne le conteneur des tags dans le DOM
  if (!tagContainer) {
    console.error('Élément #tag-container non trouvé'); // Si le conteneur n'existe pas, affiche une erreur
    return;
  }

  tagContainer.innerHTML = ''; // Réinitialise l'affichage des tags à chaque mise à jour

  // Pour chaque catégorie (ingrédients, appareils, ustensiles), on affiche les tags sélectionnés
  for (const [category, tagsArray] of Object.entries(selectedTags)) {
    tagsArray.forEach(tagText => {
      const tag = document.createElement('span'); // Création d'un élément "span" pour chaque tag
      tag.className = 'inline-flex justify-between bg-yellow-400 text-black rounded px-2 py-2 items-center w-44'; // Style du tag
      tag.textContent = tagText; // Texte du tag

      // Création de l'icône de suppression
      const removeIcon = createRemoveIcon(tagText, category);
      tag.appendChild(removeIcon); // Ajout de l'icône de suppression au tag
      tagContainer.appendChild(tag); // Ajout du tag au conteneur de tags
    });
  }
}

// Fonction pour créer l'icône de suppression
function createRemoveIcon(tagText, category) {
  const removeIcon = document.createElement('span');
  removeIcon.style.position = 'relative'; // Pour positionner correctement l'icône

  const img = document.createElement('img');
  img.src = './assets/icone close tag.png'; // Chemin de l'image de suppression
  img.alt = 'Supprimer'; // Texte alternatif pour l'accessibilité
  img.style.width = '17px'; // Taille de l'image
  img.style.height = '17px'; // Taille de l'image
  img.style.display = 'none'; // Masquer l'image par défaut

  const xText = document.createElement('span');
  xText.textContent = 'X'; // Texte de l'icône de suppression
  xText.style.fontSize = '17px'; // Taille de la police
  xText.classList.add('ml-2', 'cursor-pointer', 'text-black-700', 'text-2xl', 'z-30'); // Classes Tailwind pour le style

  // Gestion des événements de survol
  removeIcon.appendChild(xText);
  removeIcon.appendChild(img);
  removeIcon.addEventListener('mouseenter', () => {
    xText.style.display = 'none'; // Masquer le "X"
    img.style.display = 'inline'; // Afficher l'image
  });

  removeIcon.addEventListener('mouseleave', () => {
    xText.style.display = 'inline'; // Afficher le "X"
    img.style.display = 'none'; // Masquer l'image
  });

  // Gestionnaire de clic pour supprimer le tag
  removeIcon.addEventListener('click', () => {
    removeTag(tagText, category); // Appelle la fonction pour supprimer le tag
  });

  return removeIcon; // Retourne l'icône de suppression
}

// Fonction de filtrage des options dans les filtres avancés
export function filterOptions(inputId, ulId) {
  const searchText = escapeHtml (document.getElementById(inputId).value.toLowerCase()); // Récupère le texte de recherche
  const ul = document.getElementById(ulId); // Sélectionne la liste correspondante

  // Vérifie si ul existe avant de continuer
  if (!ul) {
    console.error(`L'élément avec l'ID ${ulId} n'a pas été trouvé.`);
    return; // Sortir de la fonction si ul n'existe pas
  }

  // Parcourt chaque élément de la liste et ajuste leur affichage selon la correspondance avec le texte de recherche  
  Array.from(ul.children).forEach(li => {
    li.style.display = li.dataset.value.toLowerCase().includes(searchText) || searchText === "" ? "block" : "none";
  });
}


document.addEventListener('DOMContentLoaded', () => {
  // Fonction pour gérer l'affichage des dropdowns et l'écoute des événements d'entrée
  function setupDropdownFilter(labelFor, containerId, inputId, dropdownId) {
    const label = document.querySelector(`label[for="${labelFor}"]`);
    const dropdown = document.getElementById(dropdownId);
    const input = document.getElementById(inputId);
    const arrow = label.querySelector('.arrow');

    if (!dropdown) {
      console.error(`Dropdown avec l'ID ${dropdownId} non trouvé.`);
      return;
    }

    // Gestion de l'affichage/masquage du dropdown
    label.addEventListener('click', (e) => {
      e.preventDefault();
      dropdown.classList.toggle('hidden');
      arrow.innerHTML = dropdown.classList.contains('hidden')
        ? '<img src="./assets/flèche-descendante.png" alt="Flèche vers le bas" class="w-4 h-4 ml-10 inline-block">'
        : '<img src="./assets/flèche-montante.png" alt="Flèche vers le haut" class="w-4 h-4 ml-10 inline-block">';
    });

    // Écouteurs pour la recherche en temps réel
    input.addEventListener('input', () => {
      const safeInputValue = escapeHtml(input.value); // Échapper la valeur de l'entrée
      console.log(safeInputValue); // Par exemple, afficher dans la console
      MainfilterRecipes(safeInputValue);
    });
  }

  // Initialisation des filtres
  setupDropdownFilter('ingredients-search', 'ingredients-input-container', 'ingredients-search', 'ingredients');
  setupDropdownFilter('appareils-search', 'appareils-input-container', 'appareils-search', 'appareils');
  setupDropdownFilter('ustensiles-search', 'ustensiles-input-container', 'ustensiles-search', 'ustensiles');
});


// Fonction pour ajouter un tag dans la catégorie correspondante
function addTag(tagText, category) {
  const capitalizedTag = tagText.charAt(0).toUpperCase() + tagText.slice(1).toLowerCase();

  // Vérifie si le tag n'est pas déjà sélectionné dans la catégorie
  if (selectedTags[category] && !selectedTags[category].some(tag => tag.toLowerCase() === capitalizedTag.toLowerCase())) {
    selectedTags[category].push(capitalizedTag); // Ajoute le tag à la liste de la catégorie
    updateTagsAndFilters(); // Met à jour l'affichage des tags et les filtres
  }
}

// Fonction pour retirer un tag d'une catégorie spécifique
function removeTag(tagText, category) {
  if (selectedTags[category]) {
    const index = selectedTags[category].indexOf(tagText); // Trouver l'index du tag dans la catégorie
    if (index > -1) {
      selectedTags[category].splice(index, 1); // Supprime le tag
      updateTagsAndFilters(); // Met à jour l'affichage des tags et les filtres
    }
  }
}

// Fonction pour mettre à jour les tags et les filtres
function updateTagsAndFilters() {
  displayTags(); // Met à jour l'affichage des tags
  updateFilterOptions(recipes); // Met à jour les options des filtres
  MainfilterRecipes(); // Fonction principale de filtrage
}

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
        li.textContent = escapeHtml(item); // Nom de l'option
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

// Mettre à jour les options des filtres avancés (Ingrédients, Appareils, Ustensiles) en fonction des recettes affichées
export function updateFilterOptions(filteredRecipes) {
  const ingredientsList = document.getElementById('ingredients-search');
  const appareilsList = document.getElementById('appareils-search');
  const ustensilesList = document.getElementById('ustensiles-search');

  if (!ingredientsList || !appareilsList || !ustensilesList) {
    console.error('Un ou plusieurs éléments de filtre non trouvés');// Affiche une erreur si des éléments sont manquants
    return;
  }

  const uniqueIngredients = new Set();// Ensemble pour les ingrédients uniques
  const uniqueAppareils = new Set();// Ensemble pour les ingrédients uniques
  const uniqueUstensiles = new Set();// Ensemble pour les ingrédients uniques

// Parcourt les recettes filtrées pour extraire les ingrédients, appareils et ustensiles uniques
filteredRecipes.forEach(recipe => {
  if (recipe.ingredients) {
    recipe.ingredients.forEach(ingredient => {
      uniqueIngredients.add(ingredient.ingredient.toLowerCase().trim());// Ajoute les ingrédients en minuscules et sans espaces inutiles
    });
  }
  
  if (recipe.appliance) {
    uniqueAppareils.add(recipe.appliance.toLowerCase().trim());// Ajoute les appareils
  }
  
  if (recipe.ustensils) {
    recipe.ustensils.forEach(ustensile => {
      uniqueUstensiles.add(ustensile.toLowerCase().trim());// Ajoute les ustensiles
    });
  }
});


// Fonction pour mettre à jour les éléments de la liste des filtres (ingrédients, appareils, ustensiles)
function updateListItems(ul, items) {
  ul.innerHTML = ''; // Réinitialise la liste des éléments
  items.forEach(item => {
    const li = document.createElement('li');// Crée un élément de liste pour chaque item
    li.textContent = escapeHtml(item); // Texte de l'élément de la liste
    li.classList.add('cursor-pointer', 'hover:bg-yellow-400', 'py-2', 'px-4', 'list-item'); // Styles pour chaque élément

    // Ajoute un tag lorsqu'on clique sur un élément de la liste
    li.addEventListener('click', () => {
      const category = ul.id.includes('ingredients') ? 'ingredients' :
                      ul.id.includes('appareils') ? 'appareils' : 'ustensiles';// Détermine la catégorie du tag

      // Ajoute le tag dans la catégorie correspondante
      addTag(item, category); // Ajoute le tag correspondant

      // Ajoute la classe de fond jaune
      li.classList.toggle('selected'); // Bascule la classe sélectionnée
      
      // Gère l'affichage de l'icône de fermeture (supprimer le tag)
      if (li.classList.contains('selected','bg-yellow-400')) {
        const closeIcon = document.createElement('span');// Crée l'icône de fermeture
        closeIcon.textContent = '✖'; // Icône de fermeture
        closeIcon.classList.add('close-icon','cursor-pointer','ml-8','font-bold');// Style de l'icône

        // Écouteur d'événements pour la fermeture
        closeIcon.addEventListener('click', (e) => {
          e.stopPropagation(); // Empêche le clic sur l'élément de liste d'être déclenché
          li.classList.remove('selected'); // Enlève la sélection
          closeIcon.remove(); // Supprime l'icône de fermeture
                 
        });

        // Ajouter l'icône de fermeture à l'élément de liste
        li.appendChild(closeIcon);// Ajoute l'icône à l'élément de liste
      } else {
        // Retire l'icône de fermeture si l'élément n'est plus sélectionné
        const closeIcon = li.querySelector('.close-icon');
        if (closeIcon) {
          closeIcon.remove();
        }
      }

      // Appel des fonctions de filtrage et d'affichage des tags
      MainfilterRecipes(); 
      displayTags(); 
    });

    ul.appendChild(li); // Ajoute l'élément à la liste
  });
}
  updateListItems(ingredientsList, [...uniqueIngredients]);// Mise à jour des ingrédients
  updateListItems(appareilsList, [...uniqueAppareils]);// Mise à jour des appareils
  updateListItems(ustensilesList, [...uniqueUstensiles]);// Mise à jour des ustensiles
  
}

//Cette fonction va gérer la vérification des correspondances pour 
//les ingrédients, appareils, ustensiles et le texte de recherche.
function isRecipeMatchingFilters(recipe, selectedIngredients, selectedAppareils, selectedUstensiles, searchText) {
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
}


// Fonction de filtrage des recettes avec les filtres avancés (tags et champ de recherche principal)
export function filterRecipesWithAdvancedFilters() {
  // Récupère les éléments d'entrée pour chaque catégorie de filtres
  const ingredientInput = document.getElementById('ingredients-search');
  const appareilInput = document.getElementById('appareils-search');
  const ustensileInput = document.getElementById('ustensiles-search');

  // Récupère et normalise les valeurs saisies dans les champs de recherche
  const ingredientValue = ingredientInput ? ingredientInput.value.trim().toLowerCase() : '';
  const appareilValue = appareilInput ? appareilInput.value.trim().toLowerCase() : '';
  const ustensileValue = ustensileInput ? ustensileInput.value.trim().toLowerCase() : '';

  // Récupérer le texte de recherche principal
  const searchInputElement = document.getElementById('main-search-input');
  const searchText = searchInputElement ?  escapeHtml (searchInputElement.value.toLowerCase()) : '';

  // Affichage des logs pour déboguer
  console.log('Champ de recherche principal:', searchInputElement);
  console.log('Texte de recherche principal:', searchText);

  // Formatage des tags sélectionnés (première lettre en majuscule)
  const selectedIngredients = selectedTags.ingredients.map(tag => capitalizeFirstLetter(tag));
  const selectedAppareils = selectedTags.appareils.map(tag => capitalizeFirstLetter(tag));
  const selectedUstensiles = selectedTags.ustensiles.map(tag => capitalizeFirstLetter(tag));

  // Vérification si tous les filtres et la barre de recherche sont vides
  const isAllEmpty = selectedIngredients.length === 0 && selectedAppareils.length === 0 && selectedUstensiles.length === 0 && !searchText;

  // Si aucun filtre ni recherche, afficher toutes les recettes
  if (isAllEmpty) {
      displayRecipes(recipes);
      updateRecipeCount(1500);
      return;
  }

  // Filtre les recettes en fonction des tags et du texte de recherche
  const filteredRecipes = recipes.filter(recipe => 
      isRecipeMatchingFilters(recipe, selectedIngredients, selectedAppareils, selectedUstensiles, searchText)
  );

  // Affiche les recettes filtrées et met à jour le compteur de recettes
  displayRecipes(filteredRecipes);
  updateRecipeCount(filteredRecipes.length);

  // Si aucune recette ne correspond, afficher un message d'erreur
  if (filteredRecipes.length === 0) {
      hideRecipes();
      showErrorMessage();
  } else {
      hideErrorMessage();
      displayRecipes(filteredRecipes);
      updateFilterOptions(filteredRecipes);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  function setupFilters(labelFor, containerId, ulId, inputId, clearBtnId) {
    const label = document.querySelector(`label[for="${labelFor}"]`); // Sélectionne le label
    const inputContainer = document.getElementById(containerId); // Conteneur de l'input
    const ul = document.getElementById(ulId); // Liste des éléments (UL)
    const input = document.getElementById(inputId); // Input pour le filtre
    const clearBtn = document.getElementById(clearBtnId); // Bouton pour effacer le texte

    let isInputVisible = false; // État d'affichage de l'input et de la liste

    // Fonction pour afficher ou masquer l'input et la liste déroulante
    function toggleDropdown() {
      isInputVisible = !isInputVisible;
      
      if (isInputVisible) {
        inputContainer.classList.remove('opacity-0', 'pointer-events-none');
        label.classList.remove('label-hidden');
        ul.classList.remove('hidden');
        input.focus();
      } else {
        // Masque l'input et la liste déroulante
        inputContainer.classList.add('opacity-0', 'pointer-events-none');
        label.classList.add('label-hidden');
        ul.classList.add('hidden');
      }
    }

    // Gestion de l'affichage/masquage au clic sur le label
    label.addEventListener('click', (e) => {
      e.preventDefault();
      toggleDropdown();
    });

    input.addEventListener('focus', () => {
      input.placeholder = ''; // Efface le placeholder
    });

    input.addEventListener('blur', () => {
      if (input.value === '') {
        input.placeholder = 'Rechercher'; // Placeholder par défaut si vide
      }
    });

    // Échappe l'entrée utilisateur dans l'input pour plus de sécurité
    input.addEventListener('input', () => {
      const escapedInputValue = escapeHtml(input.value); // Échappe la valeur entrée
      input.value = escapedInputValue; // Remplace la valeur par celle échappée

      if (escapedInputValue !== '') {
        clearBtn.classList.remove('hidden'); // Affiche le bouton d'effacement
      } else {
        clearBtn.classList.add('hidden'); // Masque le bouton d'effacement
      }
    });

    clearBtn.addEventListener('click', () => {
      input.value = ''; // Vide le champ de recherche
      clearBtn.classList.add('hidden');
      input.focus();
    });

    // Gestion des sélections dans la liste (UL)
    ul.addEventListener('click', (e) => {
      const clickedItem = e.target.closest('li'); // Récupère l'élément li cliqué
      if (clickedItem) {
        const clickedValue = escapeHtml(clickedItem.textContent); // Échappe le texte de l'élément sélectionné
        console.log(`Tag ajouté depuis la liste : ${clickedValue}`);
        // Ajoute le tag correspondant
        const category = ul.id; // Utilise l'ID du UL pour déterminer la catégorie
        addTag(clickedItem.dataset.value, category); // Ajoute le tag

        // Masque l'input et la liste déroulante après la sélection
        isInputVisible = false;
        inputContainer.classList.add('opacity-0', 'pointer-events-none'); // Masque l'input
        ul.classList.add('hidden'); // Masque la liste déroulante
      }
    });
  }

  // Initialisation des filtres pour ingrédients, appareils et ustensiles
  const filterConfigs = [
    { labelFor: 'ingredients-search', containerId: 'ingredients-input-container', ulId: 'ingredients', inputId: 'ingredients-search', clearBtnId: 'ingredients-clear-search' },
    { labelFor: 'appareils-search', containerId: 'appareils-input-container', ulId: 'appareils', inputId: 'appareils-search', clearBtnId: 'appareils-clear-search' },
    { labelFor: 'ustensiles-search', containerId: 'ustensiles-input-container', ulId: 'ustensiles', inputId: 'ustensiles-search', clearBtnId: 'ustensiles-clear-search' }
  ];

  filterConfigs.forEach(config => setupFilters(config.labelFor, config.containerId, config.ulId, config.inputId, config.clearBtnId));

  // Appeler la mise à jour des filtres et ajouter les écouteurs d'événements
  updateAdvancedFilters(recipes); // Met à jour les options des filtres
  updateFilterOptions(recipes); // Met à jour les options des filtres avec toutes les recettes initiales
});
