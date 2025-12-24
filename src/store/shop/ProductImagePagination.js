export default class ProductImagePagination {
  selectors = {
    switchItem: '.image-switch__item',
    pagination: '.image-pagination',
    paginationItem: '.image-pagination__item',
  };

  stateClasses = {
    active: 'image-pagination__item--active',
  };

  constructor(productElement) {
    this.product = productElement;

    this.switchItems = this.product.querySelectorAll(this.selectors.switchItem);
    this.pagination = this.product.querySelector(this.selectors.pagination);

    if (!this.pagination || this.switchItems.length <= 1) {
      return;
    }

    this.render();
    this.bindEvents();
  }

  render() {
    this.pagination.innerHTML = '';

    this.switchItems.forEach((item, index) => {
      item.dataset.index = index;

      const li = document.createElement('li');
      li.className = 'image-pagination__item';
      li.dataset.index = index;

      if (index === 0) {
        li.classList.add(this.stateClasses.active);
      }

      this.pagination.append(li);
    });
  }

  bindEvents() {
    this.product.addEventListener('mouseenter', this.onMouseEnter, true);
    this.product.addEventListener('mouseleave', this.onMouseLeave, true);
  }

  onMouseEnter = (event) => {
    const item = event.target.closest(this.selectors.switchItem);
    if (!item) {
      return;
    }

    this.setActive(item.dataset.index);
  };

  onMouseLeave = (event) => {
    const item = event.target.closest(this.selectors.switchItem);
    if (!item) {
      return;
    }

    this.setActive(0);
  };

  setActive(index) {
    this.pagination
      .querySelectorAll(this.selectors.paginationItem)
      .forEach((el) => {
        el.classList.toggle(
          this.stateClasses.active,
          el.dataset.index === String(index),
        );
      });
  }
}
