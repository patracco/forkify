///////////////////////////////////////////
/* 
The Model receives requests from the Controller, for example:
- Controller: What recipe should I load?
- Controller: What are the search results on page 3?
- Controller: Update the servings to 4

The Model than responds to the Controller by making operations with the STATE Object. That's why we export functions

Anything related to data goes in the Model file
*/

// import { create } from 'core-js/core/object';
import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config';
// import { getJSON, sendJSON } from './helpers';
import { AJAX } from './helpers';

// state contains all the data about the application
export const state = {
  recipe: {}, // single recipe displayed
  search: {
    // list of recipes on left sidebar
    query: '', // good for analytics, to know what people search
    results: [],
    page: 1, // default page
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data; // destructuring creates a new object called 'recipe'
  // console.log(recipe);
  // let recipe2 = data.data; // -> {recipe: {…}} check the difference with this instead of above
  // console.log(recipe2);

  // giving the data received from API new names
  // note about KEY (trick to conditionally add properties to objects): only the uploaded recipe have keys. For this reason we use shortcircuit (using the && operator) which means if key exists (is not falsy) proceed to the code after the && (create key in the recipe object).
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}`);
    state.recipe = createRecipeObject(data);

    // check if the recipe that is being loaded has been bookmarked (if it's stored into array state.bookmarks). If yes, set to true, if no, set to false
    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else state.recipe.bookmarked = false;
  } catch (err) {
    // console.error(`${err} 🤯`); // try changing the recipe URL to see the error - MOVED TO RecipeView
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    // adding key will include our uploaded recipes in the search results
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    // console.log(data);
    // store data into the State object
    state.search.results = data.data.recipes.map(rec => {
      // to replace the property names use Map as it's an array
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });

    // to start every search results from page 1
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

///////////////////////////////////////////
//// ==> PAGINATION <== ////
// not async because when we need to call this function the page has already loaded
// we want 10 results per page. Need a function that receives the page number as an input. Page is sent by Controller with resultsView.render(model.getSearchResultsPage(1))
// page = state.search.page sets as default (coming from state)
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

///////////////////////////////////////////
//// ==> Update servings <== ////
export const updateServings = async function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    // new qty = (old qty * newServings) / old Servings
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  // set new servings in the State object
  state.recipe.servings = newServings;
  // console.log(recipe);
};

///////////////////////////////////////////
//// ==> ADD and DELETE bookmarks <== ////

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

// very common pattern in programming: when we ADD something we get the entire data (recipe), when we DELETE something, we only need the id.

export const addBookmark = function (recipe) {
  // Add bookmarked recipe to State
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmarked
  // if the recipe that we just received here from Controller is the same as the current recipe loaded in viewRecipe, then add 'bookmarked: true' to state.recipe
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // index is the position in the array state.bookmarks that has the same id as the id passed into this deleteBookmark function. If el => el.id === id is true, then execute the splice (delete from array)
  const index = state.bookmarks.findIndex(el => el.id === id);

  // delete bookmark
  state.bookmarks.splice(index, 1);

  // Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

export const uploadRecipe = async function (newRecipe) {
  try {
    // console.log(Object.entries(newRecipe));
    // only take the Arrays where the first element contains the word 'ingredient' and the second is not empty
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        // ing is an array. We need the data at position 1 (the data from the form fields)
        // trim removes empty spaces
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'Please use the right ingredient format, separated with commas'
          );
        // to render this error we add try/catch to the Controller, inside controlAddRecipe

        const [quantity, unit, description] = ingArr;
        // if there's a quantity, convert to number, otherwise set to null
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    // console.log(ingredients);

    // create the recipe object that is sent to the API after form submission. Must have the same Keys as the objects received from the API, like source_url and not sourceUrl.
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    // console.log(recipe);

    // with the object 'recipe' now ready to be sent to the API, we can create a new helper function called sendJSON (similar to getJSON).
    // sendJSON has 2 parameters: url and uploadData
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    console.log(data);

    state.recipe = createRecipeObject(data);
    // we want to bookmark an uploaded recipe by default
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
