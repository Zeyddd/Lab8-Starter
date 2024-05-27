// main.js

// CONSTANTS
const RECIPE_URLS = [
  'https://adarsh249.github.io/Lab8-Starter/recipes/1_50-thanksgiving-side-dishes.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/2_roasting-turkey-breast-with-stuffing.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/3_moms-cornbread-stuffing.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/4_50-indulgent-thanksgiving-side-dishes-for-any-holiday-gathering.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/5_healthy-thanksgiving-recipe-crockpot-turkey-breast.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/6_one-pot-thanksgiving-dinner.json',
];

// Run the init() function when the page has loaded
window.addEventListener('DOMContentLoaded', init);

// Starts the program, all function calls trace back here
async function init() {
  // initialize ServiceWorker
  initializeServiceWorker();
  // Get the recipes from localStorage
  let recipes;
  try {
    recipes = await getRecipes();
  } catch (err) {
    console.error(err);
  }
  // Add each recipe to the <main> element
  addRecipesToDocument(recipes);
}

function initializeServiceWorker() {
  // B1. Check if 'serviceWorker' is supported in the current browser
  if ('serviceWorker' in navigator) {
    // B2. Listen for the 'load' event on the window object
    window.addEventListener('load', () => {
      // B3. Register './sw.js' as a service worker
      navigator.serviceWorker.register('./sw.js')
        .then((registration) => {
          // B4. Log that the registration was successful
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        })
        .catch((error) => {
          // B5. Log that the registration has failed
          console.log('ServiceWorker registration failed: ', error);
        });
    });
  } else {
    console.log('Service workers are not supported in this browser.');
  }
}

async function getRecipes() {
  // A1. Check local storage to see if there are any recipes.
  let storedRecipes = localStorage.getItem('recipes');
  if (storedRecipes) {
    return JSON.parse(storedRecipes);
  }

  // A2. Create an empty array to hold the recipes that you will fetch
  let recipes = [];

  // A3. Return a new Promise.
  return new Promise(async (resolve, reject) => {
    // A4. Loop through each recipe in the RECIPE_URLS array constant declared above
    for (let url of RECIPE_URLS) {
      try {
        // A6. Fetch the URL
        let response = await fetch(url);
        // A7. Retrieve the JSON from the response
        let recipe = await response.json();
        // A8. Add the new recipe to the recipes array
        recipes.push(recipe);
        
        // A9. Check if all recipes have been retrieved and resolve the Promise
        if (recipes.length === RECIPE_URLS.length) {
          // Save recipes to localStorage
          saveRecipesToStorage(recipes);
          resolve(recipes);
        }
      } catch (error) {
        // A10. Log any errors using console.error
        console.error(error);
        // A11. Pass any errors to the Promise's reject() function
        reject(error);
      }
    }
  });
}

function saveRecipesToStorage(recipes) {
  localStorage.setItem('recipes', JSON.stringify(recipes));
}

function addRecipesToDocument(recipes) {
  if (!recipes) return;
  let main = document.querySelector('main');
  recipes.forEach((recipe) => {
    let recipeCard = document.createElement('recipe-card');
    recipeCard.data = recipe;
    main.append(recipeCard);
  });
}