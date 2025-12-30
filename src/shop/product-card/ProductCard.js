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
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="21" fill="none"><path fill="currentColor" fill-rule="evenodd" d="M12 18.023c-4.64-2.635-7.236-5.26-8.493-7.55C2.224 8.138 2.33 6.156 3.052 4.74c1.478-2.9 5.684-3.828 8.242-.593l.705.893.707-.893c2.558-3.235 6.764-2.307 8.242.593.721 1.415.827 3.398-.456 5.735-1.257 2.289-3.852 4.914-8.492 7.549zm0-15.778C8.52-1.144 3.337.215 1.448 3.922.42 5.939.4 8.555 1.93 11.34c1.517 2.763 4.548 5.69 9.634 8.502l.436.24.435-.24c5.086-2.811 8.118-5.74 9.635-8.502 1.53-2.785 1.51-5.4.482-7.418C20.662.215 15.48-1.144 12 2.245" clip-rule="evenodd"/></svg>
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
