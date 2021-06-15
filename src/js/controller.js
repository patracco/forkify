///////////////////////////////////////////
//// ==> In the controller we don't want anything related to DOM manipulation <== ////

import * as model from './model.js'; // import everything from Model.js
import { MODAL_CLOSE_SEC } from './config';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'regenerator-runtime/runtime'; // polyfilling Sync/Await
import 'core-js/stable'; // polyfilling everything else
import View from './views/View.js';

const { responseInterceptor } = require('http-proxy-middleware');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// The hot module reload prevents a refresh, so need to manually refreshing the page when you change some of the functions to make it work when running parcel and the hot module.
// if (module.hot) {
//   module.hot.accept();
// }

// Controller that is executed when reloading the page to show recipe on the page. We call them 'controllers' but they are actually eventHandlers.

const controlRecipes = async function () {
  try {
    // read the recipe ID from URL
    const id = window.location.hash.slice(1); // slice to remove the #
    // console.log(id);
    if (!id) return; // add this to avoid loading forever when there's no ID in the URL

    recipeView.renderSpinner(); // show spinner as first thing

    // 0. Update resultsView to highlight the selected recipe (to show the recipe that has the class preview__link--active without reloading the whole resultsView). Makes use of the update() method/algorithm created in View
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // 1. Loading recipe
    await model.loadRecipe(id); // refactoring for MVC

    // 2. Rendering recipe
    recipeView.render(model.state.recipe); // refactoring for MVC. Rendering the recipe: receive from Model, send to View (recipe data goes through controller, see architecture diagram). We specify here what data of the STATE OBJECT (from MODEL) we want to send to recipeView.
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

// Controller executed when you search for a keyword that shows recipe list on left sidebar
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner(); // remember: first specify where to execute the function (I want to run the spinner on the resultsView)

    // 1. Get the search query
    const query = searchView.getQuery();
    searchView._clearInput();
    // console.log(query);
    if (!query) return;

    // 2. Load search results
    await model.loadSearchResults(query);

    // console.log(model.state.search.results); // remember: anything coming from another file, has to start with the file name (model.) - model.state.search.results is the array with all the results from the query searched

    // resultsView.render(model.state.search.results); // we pass all the results of the query to the resultsView. Inside resultsView becomes this._data. We specify here what data of the STATE OBJECT (from MODEL) we want to send to resultsView - REPLACED WITH BELOW FOR PAGINATION

    // 3. Render search results - default page 1 (can also leave empty)
    resultsView.render(model.getSearchResultsPage(1));

    // 4. Render initial pagination buttons
    // To know what buttons to display, we need to send: results, page and resultsPerPage, so we send the whole state.search from Model to paginationView
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
  }
};

// controller that is executed when click on one of the pagination buttons
// receives back the page where to go to from pagination View with handler(goToPage);
const controlPagination = function (goToPage) {
  // 1. Render NEW search results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2. Render NEW pagination buttons
  paginationView.render(model.state.search);
};

// Controller that is executed when the user changes servings
const controlServings = function (newServings) {
  // update the servings (in State)
  model.updateServings(newServings);

  // update the recipeView
  // recipeView.render(model.state.recipe); // this re-render the whole recipe. We use Update instead to only update what's changed on the page
  recipeView.update(model.state.recipe);

  // render bookmarks
};

const controlAddBookmark = function () {
  // only bookmark if it's not bookmarked already
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  // remove bookmark if bookmarked
  else model.deleteBookmark(model.state.recipe.id);
  recipeView.update(model.state.recipe);

  // add bookmarks to bookmarksView (popup)
  bookmarksView.render(model.state.bookmarks);
};

// render the bookmarks in the popup (loads from localStorage when page loads)
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

// async function because depends on other async functions, like model.uploadRecipe
const controlAddRecipe = async function (newRecipe) {
  //we use try/catch to be able to render the error if the user enters the wrong ingredient format in the form. Error created in Model
  try {
    // show spinner
    addRecipeView.renderSpinner();

    // upload new recipe data
    // need await because model.uploadRecipe is async
    await model.uploadRecipe(newRecipe);
    // console.log(model.state.recipe);

    // render newly uploaded recipe
    recipeView.render(model.state.recipe);

    // success message
    addRecipeView.renderSuccess();

    //ender bookmark view
    bookmarksView.render(model.state.bookmarks);

    // change ID in URL. window.history.pushState allows to update the url without reloading the page -> has 3 params (state, title [, url]), we only need the third: URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // close form window after some time

    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes); // Publisher-Subscriber Pattern to listen for an event (hashchange and page load)
  recipeView.addHandlerUpdateServings(controlServings); // Publisher-Subscriber Pattern to listen to servings button click
  searchView.addHandlerSearch(controlSearchResults); // Publisher-Subscriber Pattern to listen to queries in the search field
  paginationView.addHandlerClick(controlPagination); // Publisher-Subscriber Pattern to listen to pagination button clicks
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
