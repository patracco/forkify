import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

// code copied from resultsView
class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet.';
  _successMessage = '';

  // when page loads add the bookmarks that are stored in localStorage to the bookmarks popup
  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  /*  Refactored after we added previewView
 _generateMarkup() {
    return this._data.map(this._generateMarkupPreview).join('');
  }
  _generateMarkupPreview(result) {
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
 1. bookmark => previewView.render(bookmark, false)) creates a string.
 2. map turns the string into an array of strings
 3. join joins all the strings of the array into a big string because the markup to be created is html code = string
 */
  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new BookmarksView();
