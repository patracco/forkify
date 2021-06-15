import View from './View.js';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _successMessage = 'Recipe was successfully uploaded';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  // we add a constructor because we want to run a function as soon as the page loads. The control does not interfere at all here, but we still need to import this view to the controller or the handler _addHandlerShowWindow will never be executed
  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }
  toggleWindow() {
    this._window.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }
  _addHandlerShowWindow() {
    // add .bind so this refers to _toggleWindow instead of _btnOpen
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      // collect the form data using a modern browser API called FormData -> new FormData(this)
      // we then added [...] to spread the form data into an array (and into an object with Object.fromEntries further below)
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr); // Object.fromEntries is the opposite of Object.entries
      // now go create the controlAddRecipe in the Controller
      handler(data);
    });
  }
  _generateMarkup() {}
}

export default new AddRecipeView();
