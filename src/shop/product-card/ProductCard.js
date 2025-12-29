import Storage from '../../js/localStorage/Storage';

// Инициализируем хранилища вне класса
const cartStorage = new Storage('user_cart');
const favStorage = new Storage('user_favorites');

export default class ProductCard {
  settings = {
    rootAttribute: 'data-product',
    rootClass: 'products__item',
  };

  attributes = {
    buyBtn: 'data-card-buy-btn',
    favorite: 'data-card-favorite',
    price: 'data-card-price',
  };

  stateClasses = {
    active: 'is-active',
    inCart: 'is-in-cart', // добавим класс для корзины
  };

  constructor(product = {}) {
    this.product = product;
    this.element = null;
    this.subElements = {};
  }

  #formatPrice(price) {
    return new Intl.NumberFormat('uk-UA').format(price);
  }

  getTemplate() {
    const { id, image, model, description, article, price } = this.product;

    return `
      <article class="product" data-product-id="${id}">
        <a href="/card.html?id=${id}" target="_blank" class="product__image ibg">
          <img src="${image}" alt="${model}" width="285" height="215" loading="lazy" />
        </a>
        <div class="product__bottom">
          <div class="product__actions">
            <button type="button" ${this.attributes.favorite} class="product__link product__link-favorite">
              <img src="assets/img/svg/favorite-card.svg" alt="Favorite" width="24" height="21" />
            </button>
          </div>
          <a href="/card.html?id=${id}" target="_blank" class="product__title">${model}</a>
          <div class="product__descr"><p>${description}</p></div>
          <div class="product__article">Артикул: ${article}</div>
          <div class="product__price product-price">
            <div ${this.attributes.price} class="product__price-current">
              ${this.#formatPrice(price)} грн
            </div>
          </div>
          <button type="button" ${this.attributes.buyBtn} class="button button--card product__btn">
            До кошика
          </button>
        </div>
      </article>
    `;
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getTemplate();

    this.element = document.createElement('li');
    this.element.classList.add(this.settings.rootClass);
    this.element.setAttribute(this.settings.rootAttribute, this.product.id);
    this.element.append(wrapper.firstElementChild);

    this.#initSubElements();
    this.#applyInitialState(); // <-- Применяем данные из Storage
    this.#initEventListeners();

    return this.element;
  }

  #initSubElements() {
    const elements = this.element.querySelectorAll(
      '[data-card-buy-btn], [data-card-favorite], [data-card-price]',
    );

    elements.forEach((el) => {
      const name = Object.keys(el.dataset)[0];
      this.subElements[name] = el;
    });
  }

  // Новый метод для синхронизации UI с хранилищем при загрузке
  #applyInitialState() {
    const id = this.product.id;

    // Проверка избранного
    if (favStorage.check(id)) {
      this.subElements.cardFavorite?.classList.add(this.stateClasses.active);
    }

    // Проверка корзины
    if (cartStorage.check(id)) {
      this.#updateBuyButton(true);
    }
  }

  #initEventListeners() {
    // Обработка избранного
    this.subElements.cardFavorite?.addEventListener('click', () => {
      favStorage.toggle(this.product.id);
      this.subElements.cardFavorite.classList.toggle(this.stateClasses.active);
    });

    // Обработка корзины
    this.subElements.cardBuyBtn?.addEventListener('click', () => {
      cartStorage.toggle(this.product.id);
      const isInCart = cartStorage.check(this.product.id);
      this.#updateBuyButton(isInCart);

      // Оповещаем систему, что данные в корзине изменились
      document.dispatchEvent(new CustomEvent('cart:updated'));
    });
  }

  // Выносим обновление кнопки в отдельный метод, чтобы не дублировать код
  #updateBuyButton(isInCart) {
    const btn = this.subElements.cardBuyBtn;
    if (!btn) {
      return;
    }

    btn.textContent = isInCart ? 'В кошику' : 'До кошика';
    btn.classList.toggle(this.stateClasses.inCart, isInCart);
  }

  updatePrice(newPrice) {
    this.product.price = newPrice;
    if (this.subElements.cardPrice) {
      this.subElements.cardPrice.textContent = `${this.#formatPrice(newPrice)} грн`;
    }
  }

  destroy() {
    if (this.element) {
      this.element.remove();
    }
    this.element = null;
    this.subElements = {};
  }
}
