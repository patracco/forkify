///////////////////////////////////////////
//// ==> This is a parent class of all the VIEWS elements/objects <== ////
import icons from 'url:../../img/icons.svg';

// we export straight away because we don't need to create any instances of the View class, but we export the View class itself to create children classes (recipeView, resultsView and searchView).
// we need this parent because the children views have common properties and methods
export default class View {
  // _data represents the state object from Model. The Controller reads from Model and sends here
  _data;

  // find out more about documenting on jsdoc.app
  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM. [] means optional, true is the default
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {Object} View instance
   * @author Jonas Schmedtmann
   * @todo Finish implementation
   */

  // added 'render = true' and 'if(!render) return markup' after we created the previewView
  render(data, render = true) {
    // if there's no data, or if there's data and it is and array and the array is empty
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError(); // displays a different message, depending on the child view

    // receives from Controller
    this._data = data; // this is the recipe object
    // console.log(data);

    const markup = this._generateMarkup(); // _generateMarkup is defined inside the child class, because it is different per each child

    // render = false is passed by _generateMarkup() from resultsView and bookmarksView. Creates a markup (html element) when render = false
    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup); // add all the above html. _parentElement corresponds to the child Class
  }

  // we create 'update' to compare Update and Render and only change the elements that change in the DOM, instead of re-rendering the whole View
  update(data) {
    this._data = data;

    const updatedMarkup = this._generateMarkup();
    // updatedMarkup is a String, which makes it very hard to compare this one with markup in the render function above. We need to convert it into a DOM object using the below
    const newDOM = document
      .createRange()
      .createContextualFragment(updatedMarkup);

    // converts the newDOM into an Array so we can loop through and compare to the curElements
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    // loop through the newElements (array) and compare with the ones currently rendered on the page (curElements) to find differences
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log(curEl, newEl.isEqualNode(curEl));

      // ALGORITHM - ONLY UPDATES TEXT
      // if the new element is not equal to the current element and the new element does not contain (firstChild, and if the firstChild exists) and empty string (remove any empty space with trim)
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log('💥', newEl.firstChild.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }

      // ALGORITHM - UPDATES ATTRIBUTES (like button attributes data-update-to or anything inside html tags)
      // if the new element is not equal to the current element, create an array (so we can loop through) from the object newEl and for each attribute take the name and set/change the current to the new value (from the newEl)

      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = ''; // removes the placeholder html
  }

  renderSpinner() {
    const markup = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
  <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
          `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderSuccess(message = this._successMessage) {
    const markup = `
    <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
          `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
