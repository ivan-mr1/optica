export default class FavoriteList {
  selectors = {
    list: '[data-favorite-list]',
    totalPrice: '.favorite__fullprice',
  };

  constructor(storage, allProducts, cartStorage) {
    this.storage = storage; // user_favorites
    this.cartStorage = cartStorage; // user_cart
    this.allProducts = allProducts;
    this.element = document.querySelector(this.selectors.list);
    this.totalPriceElement = document.querySelector(this.selectors.totalPrice);
    this.formatter = new Intl.NumberFormat('uk-UA');

    if (!this.element) {
      return;
    }

    this.init();
  }

  init() {
    this.render();
    this.initEventListeners();

    // Подписываемся на обновление избранного: перерендерим список автоматически
    document.addEventListener('favorite:updated', () => this.render());
  }

  render() {
    const favIds = this.storage.get();

    const productsToRender = this.allProducts.filter((p) =>
      favIds.includes(Number(p.id)),
    );

    if (productsToRender.length === 0) {
      this.element.innerHTML =
        '<li class="favorite__empty">Ваш список порожній</li>';
      this.#updateTotalPrice(0);
      return;
    }

    this.element.innerHTML = productsToRender
      .map((product) => this.template(product))
      .join('');

    const total = productsToRender.reduce((sum, p) => sum + Number(p.price), 0);
    this.#updateTotalPrice(total);
  }

  template(product) {
    const { id, image, model, price, article } = product;
    return `
      <li class="favorite__item">
        <article class="favorite__product favorite-product" data-product-id="${id}">
          <a href="/card.html?id=${id}" target="_blank" class="favorite-product__image">
            <img src="${image}" alt="${model}" width="80" height="80" loading="lazy" />
          </a>
          <div class="favorite-product__wrapper">
            <a href="/card.html?id=${id}" target="_blank" class="favorite-product__title">${model}</a>
            <div class="favorite-product__inner">
              <div class="favorite-product__article">Art: ${article}</div>
              <div class="favorite-product__price">${this.formatter.format(price)} грн</div>
            </div>
          </div>
          <div class="favorite-product__buttons">
            <button data-favorite-remove-btn class="favorite-product__btn favorite-product__delete" title="Видалити">
              <svg class="svg svg--20">
                <use xlink:href="#icon-monochrome-trash"></use>
              </svg>
            </button>
            <button data-favorite-buy-btn class="favorite-product__btn favorite-product__cart" title="В кошик">
              <svg class="svg svg--20">
                <use xlink:href="#icon-monochrome-cart"></use>
              </svg>
            </button>
          </div>
        </article>
      </li>`;
  }

  initEventListeners() {
    this.element.addEventListener('click', (e) => {
      const productCard = e.target.closest('[data-product-id]');
      if (!productCard) {
        return;
      }

      const productId = Number(productCard.dataset.productId);

      // Кнопка удаления
      if (e.target.closest('[data-favorite-remove-btn]')) {
        // Останавливаем всплытие, чтобы FavoriteDropdown не поймал клик на document
        e.stopPropagation();
        this.storage.remove(productId);
        // Dispatch события произойдет внутри Storage.remove()
      }

      // Кнопка добавления в корзину
      if (e.target.closest('[data-favorite-buy-btn]') && this.cartStorage) {
        // Останавливаем всплытие, чтобы меню не закрылось при покупке
        e.stopPropagation();
        this.cartStorage.add(productId);
      }
    });
  }

  #updateTotalPrice(total) {
    if (this.totalPriceElement) {
      this.totalPriceElement.textContent = `${this.formatter.format(total)} грн`;
    }
  }
}
