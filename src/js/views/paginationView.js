import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  // event listener to know what pagination button is clicked
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      //   console.log(btn);
      if (!btn) return; // or there's an error when clicking outside the button
      const goToPage = +btn.dataset.goto; // from <button data-goto="", remember "+" means convert to number
      //   console.log(goToPage);

      // Sends the page number to tell what page to load back to Controller to 'const controlPagination = function (goToPage)'
      handler(goToPage);
    });
    //
  }

  _generateMarkup() {
    // console.log(this._data);
    // this._data comes from paginationView.render(model.state.recipe) from Controller

    // Scenarios:
    console.log(this._data.page);
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // 1. We're on page 1 and there are other pages
    if (this._data.page === 1 && numPages > 1) {
      console.log('scenario 1');
      return `
    <button data-goto="${
      this._data.page + 1
    }" class="btn--inline pagination__btn--next">
            <span>Page ${this._data.page + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
    `;
    }

    // 2. We're on the last page
    if (this._data.page === numPages && this._data.page > 1) {
      console.log('Last page');
      return `
    <button data-goto="${
      this._data.page - 1
    }"class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${this._data.page - 1}</span>
          </button>
          `;
    }
    // 3. We're on any other page
    if (this._data.page > 1 && this._data.page < numPages) {
      console.log('Any other page');
      return `
    <button data-goto="${
      this._data.page - 1
    }"class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${this._data.page - 1}</span>
          </button>
          <button data-goto="${
            this._data.page + 1
          }"class="btn--inline pagination__btn--next">
            <span>Page ${this._data.page + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
          `;
    }
    // 4. We're on page 1 and there are NO other pages
    console.log('Page 1 only');
    return '';
  }
}
export default new PaginationView();
