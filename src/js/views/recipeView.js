import View from './View.js';
// import icons from '../img/icons.svg'; // Parcel 1
import icons from 'url:../../img/icons.svg'; // Parcel 2 Need to import all the icons or they won't appear in browser. This happens because we use Parcel which creates 'dist' files with new URLs.

import { Fraction } from 'fractional'; // npm library to convert units (i.e. 0.5 to 1/2). Destructure to not having to use Fraction.Fraction but only Fraction

// receives the recipe data from controller with 'recipeView.render(model.state.recipe);'
// remember: a class is simply an OBJECT
class RecipeView extends View {
  _parentElement = document.querySelector('.recipe');
  _errorMessage = 'We could not find a recipe, please try another one';
  _successMessage =
    'Start by searching for a recipe or an ingredient. Have fun!';

  // Listening to Events (but handled in controller.js) - Publisher-Subscriber Pattern
  // this has no '#' because it's part of the PUBLIC API (needs to be called from an external file, in this case from controller.js)
  addHandlerRender(handler) {
    /*  
window.addEventListener('hashchange', controlRecipes); // not enough to load the recipe when the hash changes. We need to also listen to the 'load' event

window.addEventListener('load', controlRecipes);
    */

    // replaced the above with forEach
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler)); // 'handler' is the controlRecipes function from controller.js. Only works after you add recipeView.addHandlerRender(controlRecipes) in Controller
  }

  // event listener to know what servings button is clicked
  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--update-servings'); // event delegation
      // console.log(btn); // only works after you add recipeView.addHandlerUpdateServings(controlServings) in the controller
      if (!btn) return;

      // const updateTo = +btn.dataset.updateTo; // from data-update-to", remember "+" means convert to number
      // if (updateTo > 0) handler(updateTo); // handler is the controlServings function in the Controller

      // same as above, but with destructuring
      const { updateTo } = btn.dataset;
      if (+updateTo > 0) handler(+updateTo);
    });
  }

  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return;
      handler();
    });
  }

  _generateMarkup() {
    // this._data comes from recipeView.render(model.state.recipe) from Controller
    return `
    <figure class="recipe__fig">
              <img src="${this._data.image}" alt="Tomato" class="recipe__img" />
              <h1 class="recipe__title">
                <span>${this._data.title}</span>
              </h1>
            </figure>
    
            <div class="recipe__details">
              <div class="recipe__info">
                <svg class="recipe__info-icon">
                  <use href="${icons}#icon-clock"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--minutes">${
                  this._data.cookingTime
                }</span>
                <span class="recipe__info-text">minutes</span>
              </div>
              <div class="recipe__info">
                <svg class="recipe__info-icon">
                  <use href="${icons}#icon-users"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--people">${
                  this._data.servings
                }</span>
                <span class="recipe__info-text">servings</span>
    
                <div class="recipe__info-buttons">
                  <button class="btn--tiny btn--update-servings" data-update-to="${
                    this._data.servings - 1
                  }">
                    <svg>
                      <use href="${icons}#icon-minus-circle"></use>
                    </svg>
                  </button>
                  <button class="btn--tiny btn--update-servings" data-update-to="${
                    this._data.servings + 1
                  }">
                    <svg>
                      <use href="${icons}#icon-plus-circle"></use>
                    </svg>
                  </button>
                </div>
              </div>
    
              <div class="recipe__user-generated ${
                this._data.key ? '' : 'hidden'
              }">
                <svg>
                  <use href="${icons}#icon-user"></use>
                </svg>
              </div>
              <button class="btn--round btn--bookmark">
                <svg class="">
                  <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
                </svg>
              </button>
            </div>

            <div class="recipe__ingredients">
              <h2 class="heading--2">Recipe ingredients</h2>
              <ul class="recipe__ingredient-list">
              ${this._data.ingredients
                .map(this._generateMarkupIngredient)
                .join('')}
              </ul>
            </div>
    
            <div class="recipe__directions">
              <h2 class="heading--2">How to cook it</h2>
              <p class="recipe__directions-text">
                This recipe was carefully designed and tested by
                <span class="recipe__publisher">${
                  this._data.publisher
                }</span>. Please check out
                directions at their website.
              </p>
              <a
                class="btn--small recipe__btn"
                href="${this._data.sourceUrl}"
                target="_blank"
              >
                <span>Directions</span>
                <svg class="search__icon">
                  <use href="${icons}#icon-arrow-right"></use>
                </svg>
              </a>
            </div>
    `;
  }
  _generateMarkupIngredient(ing) {
    return `
        <li class="recipe__ingredient">
        <svg class="recipe__icon">
          <use href="${icons}#icon-check"></use>
        </svg>
        <div class="recipe__quantity">${
          ing.quantity
            ? new Fraction(ing.quantity).toString() // new Fraction from documentation
            : ''
        }</div>
        <div class="recipe__description">
          <span class="recipe__unit">${ing.unit}</span>
          ${ing.description}
        </div>
      </li>
    `;
  }
}

export default new RecipeView(); // exporting here (instead of export class) means that we export an INSTANCE of the OBJECT created by the class RecipeView.
