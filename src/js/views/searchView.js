import View from './View.js';

// remember: a class is simply an OBJECT
class SearchView extends View {
  _parentEl = document.querySelector('.search'); // _parentEl doesn't need the exact same name as parent class ((_parentElement) because this is not used to run any common functions, such as renderSpinner()
  getQuery() {
    return this._parentEl.querySelector('.search__field').value;
  }
  _clearInput() {
    // to clear the search field after submit/enter
    this._parentEl.querySelector('.search__field').value = '';
  }
  addHandlerSearch(handler) {
    // this.#parentEl.addEventListener('submit', handler); // this is wrong because we need to prevent page reload
    this._parentEl.addEventListener('submit', function (e) {
      // works both with clicking submit, or pressing enter
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView(); // exporting here (instead of export class) means that we export an INSTANCE of the OBJECT created by the class SearchView.
