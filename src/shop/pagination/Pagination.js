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
    hidden: 'is-hidden',
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

    this.renderPagination();
    this.render();
    this.bindEvents();
  }

  /**
   * Считает общее количество страниц
   */
  getPagesCount() {
    return Math.ceil(this.products.length / this.state.productsPerPage);
  }

  /**
   * Основной метод обновления: товары + состояние кнопок
   */
  render() {
    this.#renderProducts();
    this.renderPagination(); // Перерисовываем кнопки, чтобы обновить "многоточие"
    this.#updateArrowsState();
  }

  /**
   * Нарезка массива продуктов и рендер в контейнер
   */
  #renderProducts() {
    const { currentPage, productsPerPage } = this.state;
    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;

    const productsSlice = this.products.slice(start, end);
    this.renderList.render(productsSlice);

    // Умный скролл вверх с запасом (например, под шапку)
    if (currentPage > 1) {
      const yOffset = -100;
      const element = this.renderList.container;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  /**
   * Генерация кнопок пагинации с логикой многоточия
   */
  renderPagination() {
    const pagesCount = this.getPagesCount();

    if (pagesCount <= 1) {
      this.pagination?.classList.add(this.stateClasses.hidden);
      return;
    }

    this.paginationList.innerHTML = '';
    const fragment = document.createDocumentFragment();
    const { currentPage } = this.state;

    // Настройки видимости (1 ... 4 5 [6] 7 8 ... 20)
    const range = 2;
    const left = currentPage - range;
    const right = currentPage + range;

    for (let i = 1; i <= pagesCount; i++) {
      if (i === 1 || i === pagesCount || (i >= left && i <= right)) {
        fragment.append(this.#createPageItem(i));
      } else if (i === left - 1 && i > 1) {
        fragment.append(this.#createSeparator());
      } else if (i === right + 1 && i < pagesCount) {
        fragment.append(this.#createSeparator());
      }
    }

    this.paginationList.append(fragment);
    this.pagination?.classList.remove(this.stateClasses.hidden);
  }

  /**
   * Создание HTML-элемента страницы
   */
  #createPageItem(pageNum) {
    const li = document.createElement('li');
    li.className = 'pagination__item';
    if (pageNum === this.state.currentPage) {
      li.classList.add(this.stateClasses.active);
    }
    li.dataset.page = pageNum;
    li.textContent = pageNum;
    return li;
  }

  /**
   * Создание разделителя "..."
   */
  #createSeparator() {
    const li = document.createElement('li');
    li.className = 'pagination__separator';
    li.textContent = '...';
    return li;
  }

  /**
   * Блокировка стрелок на первой и последней страницах
   */
  #updateArrowsState() {
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

  /**
   * Внешний метод для обновления списка товаров (например, при фильтрации)
   */
  updateProducts(products) {
    this.products = products || [];
    this.state.currentPage = 1;
    this.renderPagination();
    this.render();
  }
}
