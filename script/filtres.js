import { recipes } from './recipes.js'; // Importe les données des recettes
import { displayRecipes, showErrorMessage, hideErrorMessage, updateRecipeCount } from './index.js'; // Importe des fonctions pour afficher les recettes, gérer les erreurs et mettre à jour le compteur
import { MainfilterRecipes, updateAdvancedFilters } from './main.js'; // Import de la fonction principale de filtrage depuis main.js


// Objet pour stocker les tags sélectionnés par catégorie
export const selectedTags = {
  ingredients: [],// Tags d'ingrédients sélectionnés
  appareils: [],// Tags d'appareils sélectionnés
  ustensiles: []// Tags d'ustensiles sélectionnés
};

// Fonction pour afficher les tags dans l'interface utilisateur
export function displayTags() {
  const tagContainer = document.getElementById('tag-container');// Sélectionne le conteneur des tags dans le DOM
  if (!tagContainer) {
    console.error('Élément #tag-container non trouvé');// Si le conteneur n'existe pas, on affiche une erreur
    return;
  }

  tagContainer.innerHTML = ''; // Réinitialise l'affichage des tags à chaque mise à jour

  // Pour chaque catégorie (ingrédients, appareils, ustensiles), on affiche les tags sélectionnés
  for (const [category, tagsArray] of Object.entries(selectedTags)) {
    tagsArray.forEach(tagText => {
      const tag = document.createElement('span');// Création d'un élément "span" pour chaque tag
      tag.className = 'inline-flex justify-between bg-yellow-400 text-black rounded px-2 py-2 items-center w-44';// Style du tag

      tag.textContent = tagText; // Texte du tag

      // Création de l'icône de suppression (un "X")
      const removeIcon = document.createElement('span');
      removeIcon.style.position = 'relative'; // Pour positionner correctement l'icône

      // Création d'une image pour l'icône de suppression
      const img = document.createElement('img');
      img.src = './assets/icone close tag.png'; // Chemin de l'image de suppression
      img.alt = 'Supprimer'; // Texte alternatif pour l'accessibilité
      img.style.width = '17px'; // Taille de l'image
      img.style.height = '17px'; // Taille de l'image
      img.style.display = 'none'; // Masquer l'image par défaut

      // Ajout d'un "X" textuel pour la suppression
      const xText = document.createElement('span');
      xText.textContent = 'X'; // Texte de l'icône de suppression
      xText.style.fontSize = '17px'; // Taille de la police
      xText.classList.add('ml-2', 'cursor-pointer', 'text-black-700', 'text-2xl','z-30'); // Classes Tailwind pour le style

       // Gestion des événements de survol pour basculer entre le "X" et l'image
      removeIcon.appendChild(xText); // Ajoute le "X" à l'icône
      removeIcon.appendChild(img); // Ajoute l'image à l'icône

      // Événements de survol
      removeIcon.addEventListener('mouseenter', () => {
          xText.style.display = 'none'; // Masquer le "X"
          img.style.display = 'inline'; // Afficher l'image
      });

      removeIcon.addEventListener('mouseleave', () => {
          xText.style.display = 'inline'; // Afficher le "X"
          img.style.display = 'none'; // Masquer le "X"
      });

       // Gestionnaire de clic pour supprimer le tag
      removeIcon.addEventListener('click', () => {
        removeTag(tagText, category); // Appelle la fonction pour supprimer le tag
        filterRecipesWithAdvancedFilters(); // Met à jour les recettes en fonction des tags restants
        MainfilterRecipes();// Fonction principale de filtrage
      });

      tag.appendChild(removeIcon); // Ajout de l'icône de suppression au tag
      tagContainer.appendChild(tag); // Ajout du tag au conteneur de tags
    });
  }
}

// Fonction pour ajouter un tag dans la catégorie correspondante
function addTag(tagText, category) {
  // Met la première lettre en majuscule et met le reste en minuscules
  const capitalizedTag = tagText.charAt(0).toUpperCase() + tagText.slice(1).toLowerCase();

  // Vérifie si le tag n'est pas déjà sélectionné dans la catégorie
  if (selectedTags[category] && !selectedTags[category].some(tag => tag.toLowerCase() === capitalizedTag.toLowerCase())) {
    selectedTags[category].push(capitalizedTag); // Ajoute le tag à la liste de la catégorie
    displayTags(); // Affiche les tags mis à jour
    updateFilterOptions(recipes); // Met à jour les options des filtres en fonction des recettes restantes
    MainfilterRecipes();// Fonction principale de filtrage
  }
}

// Fonction pour retirer un tag d'une catégorie spécifique
function removeTag(tagText, category) {
  if (selectedTags[category]) {
    // Vérifie que le tag existe dans la catégorie
    const index = selectedTags[category].indexOf(tagText);// Trouver l'index du tag dans la catégorie
    if (index > -1) {
      selectedTags[category].splice(index, 1); // Supprime le tag
      displayTags(); // Met à jour l'affichage des tags
      updateFilterOptions(recipes); // Met à jour les options des filtres

      // Filtre les recettes après la suppression du tag
      MainfilterRecipes(); // Fonction principale de filtrage
    }
  }
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
    li.textContent = item; // Texte de l'élément de la liste
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

// Fonction pour masquer les recettes en vidant le conteneur
function hideRecipes() {
  const recipeContainer = document.getElementById('results-container');
  if (recipeContainer) {
    recipeContainer.innerHTML = ''; // Efface les recettes affichées
  }
}

// Fonction pour capitaliser la première lettre d'une chaîne et passer le reste en minuscules
export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

// Récupère les tags sélectionnés, les formatte avec la première lettre en majuscule, et les trie par ordre alphabétique
const selectedIngredients = selectedTags.ingredients
  .map(tag => capitalizeFirstLetter(tag))
  .sort();
  const selectedAppareils = selectedTags.appareils
  .map(tag => capitalizeFirstLetter(tag))
  .sort();

const selectedUstensiles = selectedTags.ustensiles
  .map(tag => capitalizeFirstLetter(tag))
  .sort();


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
  const searchInputElement = document.getElementById('main-search-input'); // Assurez-vous que l'ID est correct
  const searchText = searchInputElement ? searchInputElement.value.toLowerCase() : ''; // Vérifiez si l'élément existe

  // Affichage des logs pour déboguer
  console.log('Champ de recherche principal:', searchInputElement); // Vérifie si l'élément est récupéré
  console.log('Texte de recherche principal:', searchText); // Vérifie la valeur récupérée

   // Formatage des tags sélectionnés (première lettre en majuscule)
  const selectedIngredients = selectedTags.ingredients.map(tag => capitalizeFirstLetter(tag));
  const selectedAppareils = selectedTags.appareils.map(tag => capitalizeFirstLetter(tag));
  const selectedUstensiles = selectedTags.ustensiles.map(tag => capitalizeFirstLetter(tag));

  // Vérification si tous les filtres et la barre de recherche sont vides
  const isAllEmpty = selectedIngredients.length === 0 && selectedAppareils.length === 0 && selectedUstensiles.length === 0 && !searchText;

  // Si aucun filtre ni recherche, afficher toutes les recettes
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
          ingredient.ingredient.toLowerCase().includes(tag.toLowerCase())// Vérifie si chaque ingrédient correspond à un tag
        )
      );

    const matchesAppareils = selectedAppareils.length === 0 || 
      selectedAppareils.includes(recipe.appliance?.toLowerCase() || '');// Vérifie si l'appareil correspond

    const matchesUstensiles = selectedUstensiles.length === 0 || 
      recipe.ustensils?.some(ustensile => 
        selectedUstensiles.includes(ustensile.toLowerCase())// Vérifie si les ustensiles correspondent aux tags sélectionnés
      ) || false;

    const matchesSearchText = searchText === '' || 
      recipe.name.toLowerCase().includes(searchText) || // Vérifie si le nom de la recette contient le texte de recherche
      recipe.ingredients.some(ingredient => 
        ingredient.ingredient.toLowerCase().includes(searchText)// Vérifie si un ingrédient correspond au texte de recherche
      ) || 
      recipe.description.toLowerCase().includes(searchText);// Vérifie si la description correspond au texte de recherche

    return matchesIngredients && matchesAppareils && matchesUstensiles && matchesSearchText;
  });

  // Affiche les recettes filtrées et met à jour le compteur de recettes
  displayRecipes(filteredRecipes);
  updateRecipeCount(filteredRecipes.length); // Met à jour le compteur de recettes

  // Si aucune recette ne correspond, afficher un message d'erreur, sinon afficher les recettes filtrées
  if (filteredRecipes.length === 0) {
    hideRecipes(); // Cache les recettes
    showErrorMessage(); // Affiche un message d'erreur si aucune recette ne correspond
  } else {
    hideErrorMessage(); // Cache le message d'erreur
    displayRecipes(filteredRecipes); // Affiche les recettes filtrées
    updateFilterOptions(filteredRecipes); // Met à jour les options des filtres avec les recettes filtrées
  }
}

// Ajout des écouteurs d'événements pour les filtres avancés
function listenToFilterChanges() {
  const filters = document.querySelectorAll('#ingredients, #appareils, #ustensiles');// Sélectionne les UL des filtres
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

// Appeler la mise à jour des filtres et ajouter les écouteurs d'événements au chargement de la page
updateAdvancedFilters(recipes); // Met à jour les options des filtres avec toutes les recettes initiales
listenToFilterChanges(); // Ajoute les écouteurs d'événements pour gérer les changements de filtre

// Initialisation des filtres lors du chargement de la page
window.addEventListener('load', () => {
  updateFilterOptions(recipes); // Met à jour les options des filtres avec toutes les recettes initiales les recettes initiales
  listenToFilterChanges();// Ajoute les écouteurs d'événements pour les filtres
 
});

document.addEventListener("DOMContentLoaded", function() {

// Gère l'ouverture et la fermeture des listes déroulantes pour les filtres avancés
  function toggleDropdown(dropdownId, label) {
    const dropdown = document.getElementById(dropdownId);
    const arrow = label.querySelector('.arrow');// Sélectionne l'icône de la flèche

    
    if (!dropdown) {
      console.error(`Dropdown avec l'ID ${dropdownId} non trouvé.`);
      return;
    }

 // Alterne l'affichage entre visible et masqué pour la liste déroulante
    if (dropdown.classList.contains('hidden')) {
      dropdown.classList.remove('hidden');
      arrow.innerHTML = '<img src="./assets/flèche-montante.png" alt="Flèche vers le haut" class="w-4 h-4 ml-10 inline-block">';
    } else {
      dropdown.classList.add('hidden');
      arrow.innerHTML = '<img src="./assets/flèche-descendante.png" alt="Flèche vers le bas" class="w-4 h-4 ml-10 inline-block">';
    }
  }

  // Ajoute des écouteurs d'événements pour ouvrir ou fermer les listes déroulantes des filtres
  const filters = [
    { id: 'ingredients', label: 'Ingrédients' },
    { id: 'appareils', label: 'Appareils' },
    { id: 'ustensiles', label: 'Ustensiles' },
  ];

// Ajoute des écouteurs d'événements pour les labels des filtres
  filters.forEach(filter => {
    const label = document.querySelector(`label[for="${filter.id}-search"]`); // Sélectionne le label associé au filtre
    if (label) {
      label.addEventListener('click', function() {
        toggleDropdown(filter.id, label);// Gère l'affichage du dropdown au clic
      });
    } else {
      console.warn(`Label pour ${filter.id} non trouvé.`);
    }
  });
});

// Écouteurs pour la recherche en temps réel sur les trois filtres (ingrédients, appareils, ustensiles)
document.getElementById('ingredients-search').addEventListener('input', MainfilterRecipes);
document.getElementById('appareils-search').addEventListener('input', MainfilterRecipes);
document.getElementById('ustensiles-search').addEventListener('input', MainfilterRecipes);




