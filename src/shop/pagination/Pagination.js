export default class Pagination {
  selectors = {
    pagination: '[data-pagination]',
    paginationList: '[data-pagination-list]',
    btnPrev: '[data-pagination-btn-prev]',
    btnNext: '[data-pagination-btn-next]',
    pageItem: '.pagination__item',
  };

  stateClasses = {
    active: 'is-active',
    hidden: 'hidden',
    disabled: 'disabled', // Добавили класс для неактивных стрелок
  };

  state = {
    currentPage: 1,
    productsPerPage: 12,
  };

  constructor(renderListInstance, products = []) {
    this.renderList = renderListInstance;
    this.products = products;

    this.pagination = document.querySelector(this.selectors.pagination);
    this.paginationList = document.querySelector(this.selectors.paginationList);
    this.btnPrev = document.querySelector(this.selectors.btnPrev);
    this.btnNext = document.querySelector(this.selectors.btnNext);

    if (!this.paginationList) {
      return;
    }

    // Отрисовываем кнопки пагинации ОДИН РАЗ при инициализации
    this.renderPagination();
    this.render();
    this.bindEvents();
  }

  // Основной метод обновления вида
  render() {
    this.renderProducts();
    this.updateActivePage();
    this.updateArrowsState(); // Обновляем доступность стрелок
  }

  renderProducts() {
    const { currentPage, productsPerPage } = this.state;
    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;

    const productsSlice = this.products.slice(start, end);
    this.renderList.render(productsSlice);

    // Улучшение: Скролл вверх к списку при смене страницы
    if (this.state.currentPage > 1 || start > 0) {
      this.renderList.container.scrollIntoView({ behavior: 'smooth' });
    }
  }

  renderPagination() {
    const pagesCount = this.getPagesCount();
    if (pagesCount <= 1) {
      this.pagination?.classList.add(this.stateClasses.hidden);
      return;
    }

    this.paginationList.innerHTML = '';
    const fragment = document.createDocumentFragment();

    for (let i = 1; i <= pagesCount; i++) {
      const li = document.createElement('li');
      li.className = 'pagination__item';
      li.dataset.page = i;
      li.textContent = i;
      fragment.append(li);
    }

    this.paginationList.append(fragment);
    this.pagination?.classList.remove(this.stateClasses.hidden);
  }

  getPagesCount() {
    return Math.ceil(this.products.length / this.state.productsPerPage);
  }

  updateActivePage() {
    const items = this.paginationList.querySelectorAll(this.selectors.pageItem);
    items.forEach((item) => {
      item.classList.toggle(
        this.stateClasses.active,
        Number(item.dataset.page) === this.state.currentPage,
      );
    });
  }

  // Новое: управление состоянием стрелок Prev/Next
  updateArrowsState() {
    const pagesCount = this.getPagesCount();

    if (this.btnPrev) {
      this.btnPrev.disabled = this.state.currentPage === 1;
    }
    if (this.btnNext) {
      this.btnNext.disabled = this.state.currentPage === pagesCount;
    }
  }

  bindEvents() {
    this.paginationList.addEventListener('click', this.onPageClick);
    this.btnNext?.addEventListener('click', this.onNextClick);
    this.btnPrev?.addEventListener('click', this.onPrevClick);
  }

  onPageClick = (event) => {
    const item = event.target.closest(this.selectors.pageItem);
    if (!item || item.classList.contains(this.stateClasses.active)) {
      return;
    }

    this.state.currentPage = Number(item.dataset.page);
    this.render();
  };

  onNextClick = () => {
    if (this.state.currentPage < this.getPagesCount()) {
      this.state.currentPage++;
      this.render();
    }
  };

  onPrevClick = () => {
    if (this.state.currentPage > 1) {
      this.state.currentPage--;
      this.render();
    }
  };

  updateProducts(products) {
    this.products = products || [];
    this.state.currentPage = 1;
    this.renderPagination(); // Перерисовываем кнопки, так как кол-во товаров могло измениться
    this.render();
  }
}
