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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  fill="#ffa501"
                  d="M18.572 2.857h-5v-.714C13.572.959 12.612 0 11.429 0H8.572C7.388 0 6.429.96 6.429 2.143v.714h-5a.714.714 0 1 0 0 1.429h.776L3.572 19.35c.033.369.343.65.714.649h11.428c.37.002.681-.28.715-.65l1.366-15.064h.776a.714.714 0 1 0 0-1.429M7.857 2.143c0-.395.32-.714.715-.714h2.857c.394 0 .714.32.714.714v.714H7.857zm7.205 16.428H4.938L3.643 4.286H16.36z"
                />
                <path
                  fill="#ffa501"
                  d="M7.857 16.381v-.003l-.714-10a.716.716 0 0 0-1.429.101l.715 10a.714.714 0 0 0 .714.664h.051a.714.714 0 0 0 .663-.762M10 5.714a.714.714 0 0 0-.714.715v10a.714.714 0 1 0 1.428 0v-10A.714.714 0 0 0 10 5.714M13.622 5.714a.716.716 0 0 0-.765.664l-.714 10a.714.714 0 0 0 .66.764h.053c.376.002.688-.288.715-.663l.715-10a.716.716 0 0 0-.664-.765"
                />
              </svg>
            </button>
            <button data-favorite-buy-btn class="favorite-product__btn favorite-product__cart" title="В кошик">
              <svg
                width="20"
                height="20"
                viewBox="0 0 35 29"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M26.1 19.9H7.9C5.3 19.9 3.7 18.1 3.3 16.3C3 15.2 0.7 7.1 0 4.9C-0.1 4.6 0.1 4.3 0.4 4.3H30V6.3H2.5C3.3 8.9 5 14.8 5.2 15.9C5.4 16.8 6.3 17.9 7.9 17.9H26.1V19.9Z"
                  fill="#FFA501"
                />
                <path
                  d="M24.6 24.8L23 23.7C23.2 23.4 23.4 23.1 23.5 22.7C24 21.2 27.5 8.8 29 3.5C29.5 1.4 31.3 0 33.5 0H34.7C34.8 0 35 0.2 35 0.3V1.6C35 1.8 34.8 2 34.7 2H33.5C32.3 2 31.2 2.8 30.9 4C29.4 9.3 25.9 21.8 25.4 23.4C25.2 23.9 24.9 24.4 24.6 24.8Z"
                  fill="#FFA501"
                />
                <path d="M20.5 25H8.4V27H20.5V25Z" fill="#FFA501" />
                <path
                  d="M6 29C4.3 29 3 27.6 3 26C3 24.3 4.4 23 6 23C7.7 23 9 24.4 9 26C9 27.6 7.7 29 6 29Z"
                  fill="#FFA501"
                />
                <path
                  d="M22.6 29C20.9 29 19.6 27.6 19.6 26C19.6 24.3 21 23 22.6 23C24.3 23 25.6 24.4 25.6 26C25.6 27.6 24.3 29 22.6 29Z"
                  fill="#FFA501"
                />
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
