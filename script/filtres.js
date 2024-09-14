import { recipes } from './recipes.js'; // Assure-toi que le chemin est correct


// Fonction pour remplir les options de filtre en fonction des recettes filtrées
function remplirFiltres(recettesFiltrees) {
  const selectIngredients = document.getElementById('ingredients');
  const selectAppareils = document.getElementById('appareils');
  const selectUstensiles = document.getElementById('ustensiles');

  // Vider les options actuelles
  selectIngredients.innerHTML = '<option value="">Ingrédients</option>';
  selectAppareils.innerHTML = '<option value="">Appareils</option>';
  selectUstensiles.innerHTML = '<option value="">Ustensiles</option>';

  const ingredientsSet = new Set();
  const appareilsSet = new Set();
  const ustensilesSet = new Set();

  // Parcourir les recettes filtrées pour mettre à jour les options
  recettesFiltrees.forEach(recette => {
    recette.ingredients.forEach(ingredient => {
      ingredientsSet.add(ingredient.ingredient);
    });
    if (recette.appliance) {
      appareilsSet.add(recette.appliance);
    }
    if (recette.ustensils) {
      recette.ustensils.forEach(ustensile => {
        ustensilesSet.add(ustensile);
      });
    }
  });

  // Fonction pour ajouter les options aux filtres
  const ajouterOptions = (selectElement, optionsSet) => {
    optionsSet.forEach(option => {
      const opt = document.createElement('option');
      opt.value = option;
      opt.textContent = option;
      selectElement.appendChild(opt);
    });
  };

  // Ajouter les options aux listes déroulantes
  ajouterOptions(selectIngredients, ingredientsSet);
  ajouterOptions(selectAppareils, appareilsSet);
  ajouterOptions(selectUstensiles, ustensilesSet);
}

// Fonction pour actualiser les filtres en fonction des recettes restantes
function actualiserFiltres() {
  const recettesFiltrees = filtrerParFiltres();
  remplirFiltres(recettesFiltrees);
}

// Fonction pour filtrer les recettes en fonction des filtres sélectionnés
function filtrerParFiltres() {
  const ingredientsSelectionnes = Array.from(document.getElementById('ingredients').selectedOptions)
    .map(option => option.value.toLowerCase())
    .filter(option => option !== ""); // On retire les options vides
  
  const appareilsSelectionnes = Array.from(document.getElementById('appareils').selectedOptions)
    .map(option => option.value.toLowerCase())
    .filter(option => option !== "");

  const ustensilesSelectionnes = Array.from(document.getElementById('ustensiles').selectedOptions)
    .map(option => option.value.toLowerCase())
    .filter(option => option !== "");

  // Filtrer les recettes en fonction des filtres sélectionnés
  const recettesFiltrees = recipes.filter(recette => {
    // Vérification des ingrédients
    const correspondIngredients = ingredientsSelectionnes.length === 0 ||
      recette.ingredients.some(ingredient => 
        ingredientsSelectionnes.includes(ingredient.ingredient.toLowerCase())
      );

    // Vérification des appareils
    const correspondAppareils = appareilsSelectionnes.length === 0 ||
      appareilsSelectionnes.includes(recette.appliance?.toLowerCase() || '');

    // Vérification des ustensiles
    const correspondUstensiles = ustensilesSelectionnes.length === 0 ||
      recette.ustensils?.some(ustensile => 
        ustensilesSelectionnes.includes(ustensile.toLowerCase())
      ) || false;

    // Retourner vrai si toutes les conditions sont respectées
    return correspondIngredients && correspondAppareils && correspondUstensiles;
  });

  return recettesFiltrees;
}



// Initialisation des filtres au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
  // Remplir les filtres avec les recettes initiales
  remplirFiltres(recipes);

  // Ajouter des écouteurs de changement sur les filtres pour actualiser les recettes dynamiquement
  const filtres = document.querySelectorAll('#ingredients, #appareils, #ustensiles');
  filtres.forEach(filtre => {
    filtre.addEventListener('change', function() {
      actualiserFiltres(); // Actualise les recettes et les filtres
      afficherRecettes(filtrerParFiltres()); // Ajout de la mise à jour des recettes
    });
  });
});


// Fonction pour écouter les changements des filtres
export function listenToFilterChanges() {
  const filtres = document.querySelectorAll('#ingredients, #appareils, #ustensiles');
  filtres.forEach(filtre => {
    filtre.addEventListener('change', function() {
      actualiserFiltres(); // Assurez-vous que cette fonction est correcte
    });
  });
}
