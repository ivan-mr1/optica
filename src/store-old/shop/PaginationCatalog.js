import ProductCard from './ProductCard';

export default class PaginationCatalog {
  selectors = {
    productsContainer: '[data-products-catalog]',
    pagination: '[data-pagination]',
    paginationList: '[data-pagination-list]',
    btnPrev: '[data-pagination-btn-prev]',
    btnNext: '[data-pagination-btn-next]',
    pageItem: '.pagination__item',
  };

  state = {
    currentPage: 1,
    productsPerPage: 10,
  };

  constructor(products = []) {
    this.products = products;

    this.container = document.querySelector(this.selectors.productsContainer);
    this.pagination = document.querySelector(this.selectors.pagination);
    this.paginationList = document.querySelector(this.selectors.paginationList);
    this.btnPrev = document.querySelector(this.selectors.btnPrev);
    this.btnNext = document.querySelector(this.selectors.btnNext);

    if (!this.container || !this.paginationList) {
      return;
    }

    this.render();
    this.bindEvents();
  }

  render() {
    this.renderProducts();
    this.renderPagination();
    this.updateActivePage();
  }

  renderProducts() {
    const { currentPage, productsPerPage } = this.state;

    this.container.innerHTML = '';

    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;

    this.products.slice(start, end).forEach((product) => {
      const card = new ProductCard(product);
      this.container.append(card.element);
    });
  }

  renderPagination() {
    const pagesCount = this.getPagesCount();

    this.paginationList.innerHTML = '';

    for (let i = 1; i <= pagesCount; i++) {
      const li = document.createElement('li');
      li.className = 'pagination__item';
      li.dataset.page = i;
      li.textContent = i;

      this.paginationList.append(li);
    }

    this.pagination.classList.remove('hidden');
  }

  getPagesCount() {
    return Math.ceil(this.products.length / this.state.productsPerPage);
  }

  updateActivePage() {
    const items = this.paginationList.querySelectorAll(this.selectors.pageItem);

    items.forEach((item) => {
      item.classList.toggle(
        'active',
        Number(item.dataset.page) === this.state.currentPage,
      );
    });
  }

  bindEvents() {
    this.paginationList.addEventListener('click', this.onPageClick);
    this.btnNext?.addEventListener('click', this.onNextClick);
    this.btnPrev?.addEventListener('click', this.onPrevClick);
  }

  onPageClick = (event) => {
    const item = event.target.closest(this.selectors.pageItem);
    if (!item) {
      return;
    }

    this.state.currentPage = Number(item.dataset.page);
    this.render();
  };

  onNextClick = () => {
    const pagesCount = this.getPagesCount();

    this.state.currentPage =
      this.state.currentPage >= pagesCount ? 1 : this.state.currentPage + 1;

    this.render();
  };

  onPrevClick = () => {
    const pagesCount = this.getPagesCount();

    this.state.currentPage =
      this.state.currentPage <= 1 ? pagesCount : this.state.currentPage - 1;

    this.render();
  };

  updateProducts(products) {
    this.products = products;
    this.state.currentPage = 1;
    this.render();
  }
}
