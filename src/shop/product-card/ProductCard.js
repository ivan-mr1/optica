import Storage from '../../js/localStorage/Storage';

// Инициализируем хранилища с указанием имен событий для синхронизации
const cartStorage = new Storage('user_cart', 'cart:updated');
const favStorage = new Storage('user_favorites', 'favorite:updated');

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
    inCart: 'is-in-cart',
  };

  constructor(product = {}) {
    this.product = product;
    this.element = null;
    this.subElements = {};

    // Привязываем контекст, чтобы правильно удалять слушатели в destroy()
    this.onFavoriteUpdate = this.syncFavoriteState.bind(this);
    this.onCartUpdate = this.syncCartState.bind(this);
  }

  // Форматирование цены (локализация)
  #formatPrice(price) {
    return new Intl.NumberFormat('uk-UA').format(price);
  }

  // HTML шаблон карточки
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
    this.syncFavoriteState(); // Проверка состояния избранного при загрузке
    this.syncCartState(); // Проверка состояния корзины при загрузке
    this.#initEventListeners();

    return this.element;
  }

  // Поиск всех динамических элементов внутри карточки
  #initSubElements() {
    const elements = this.element.querySelectorAll(
      '[data-card-buy-btn], [data-card-favorite], [data-card-price]',
    );

    elements.forEach((el) => {
      const name = Object.keys(el.dataset)[0];
      this.subElements[name] = el;
    });
  }

  // Синхронизация визуального состояния "Избранного"
  syncFavoriteState() {
    const isActive = favStorage.check(this.product.id);
    this.subElements.cardFavorite?.classList.toggle(
      this.stateClasses.active,
      isActive,
    );
  }

  // Синхронизация визуального состояния "Корзины"
  syncCartState() {
    const isInCart = cartStorage.check(this.product.id);
    this.#updateBuyButton(isInCart);
  }

  #initEventListeners() {
    // Клик по сердечку: просто переключаем состояние в Storage
    this.subElements.cardFavorite?.addEventListener('click', () => {
      favStorage.toggle(this.product.id);
    });

    // Клик по кнопке купить
    this.subElements.cardBuyBtn?.addEventListener('click', () => {
      if (!cartStorage.check(this.product.id)) {
        cartStorage.add(this.product.id);
      } else {
        // Опционально: переход в корзину, если товар уже там
        // window.location.href = '/cart.html';
      }
    });

    // Слушаем глобальные события (включая изменения из других вкладок)
    document.addEventListener('favorite:updated', this.onFavoriteUpdate);
    document.addEventListener('cart:updated', this.onCartUpdate);
  }

  // Метод для обновления внешнего вида кнопки покупки
  #updateBuyButton(isInCart) {
    const btn = this.subElements.cardBuyBtn;
    if (!btn) {
      return;
    }

    btn.textContent = isInCart ? 'В кошику' : 'До кошика';
    btn.classList.toggle(this.stateClasses.inCart, isInCart);
  }

  // Возможность обновить цену снаружи (например, при смене валюты или скидках)
  updatePrice(newPrice) {
    this.product.price = newPrice;
    if (this.subElements.cardPrice) {
      this.subElements.cardPrice.textContent = `${this.#formatPrice(newPrice)} грн`;
    }
  }

  // Очистка памяти при удалении карточки из DOM
  destroy() {
    if (this.element) {
      document.removeEventListener('favorite:updated', this.onFavoriteUpdate);
      document.removeEventListener('cart:updated', this.onCartUpdate);
      this.element.remove();
    }
    this.element = null;
    this.subElements = {};
  }
}
