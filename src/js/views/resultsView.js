import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class ResultsView extends View {
  _parentElement = document.querySelector('.results'); // _parentElement name must be the same as specified in renderSpinner (this._parentElement.insertAdjacentHTML('afterbegin', markup);) or any other functions that manipulate this DOM element
  _errorMessage = "Your search didn't produce any results...";
  _successMessage =
    'Start by searching for a recipe or an ingredient. Have fun!';

  /* Refactored after we added previewView

  _generateMarkup() {
    // this._data comes from resultsView.render(model.state.search.results from Controller
    // console.log(this._data); // displays in the console because _generateMarkup is run by the render() in the View with const markup = this._generateMarkup(), which is called by the Controller with resultsView.render()
    return this._data.map(this._generateMarkupPreview).join('');
  }
  _generateMarkupPreview(result) {
    // console.log(this._data); // not existent
    // we can't use ${this._data...} because generateMarkupPreview is not called anywere outside this ResultsView child class, so this function does not receive this._data as argument

    // to add a class preview__link--active to the result that is clicked
    // if the result id is equal to the id in the URL, add the class preview__link--active, otherwise do nothing ''
    // ${result.id === id ? 'preview__link--active' : ''}
    // we then added a new update() method inside Controller -> controlRecipes
    const id = window.location.hash.slice(1);

    return `
      <li class="preview">
          <a class="preview__link ${
            result.id === id ? 'preview__link--active' : ''
          }" href="#${result.id}">
              <figure class="preview__fig">
                  <img src="${result.image}" alt=${result.title} />
              </figure>
              <div class="preview__data">
                  <h4 class="preview__title">${result.title}</h4>
                  <p class="preview__publisher">${result.publisher}</p>
                  <div class="preview__user-generated">
                      <svg>
                          <use href="${icons}#icon-user"></use>
                      </svg>
                  </div>
              </div>
          </a>
      </li>
      `;
  } 

  */

  /*
 1. result => previewView.render(result, false)) creates a string.
 2. map turns the string into an array of strings
 3. join joins all the strings of the array into a big string because the markup to be created is html code = string
 */
  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}
export default new ResultsView();
