export default class CartList {
  // Настройки логики и ограничений
  settings = {
    minQuantity: 1,
    maxQuantity: 15,
  };

  selectors = {
    list: '[data-cart-list]',
    totalPrice: '[data-cart-total-price]',
  };

  constructor(storage, allProducts) {
    this.storage = storage;
    this.allProducts = allProducts;
    this.element = document.querySelector(this.selectors.list);
    this.totalPriceElements = document.querySelectorAll(
      this.selectors.totalPrice,
    );
    this.formatter = new Intl.NumberFormat('uk-UA');

    if (!this.element) {
      return;
    }

    this.init();
  }

  init() {
    this.render();
    this.initEventListeners();
    document.addEventListener('cart:updated', () => this.render());
  }

  /**
   * Группировка товаров для корректного отображения количества
   */
  getGroupedProducts() {
    const cartIds = this.storage.get();
    const counts = cartIds.reduce((acc, id) => {
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(counts)
      .map((id) => {
        const product = this.allProducts.find((p) => p.id === Number(id));
        if (product) {
          return {
            ...product,
            count: counts[id],
            totalItemPrice: product.price * counts[id],
          };
        }
        return null;
      })
      .filter((p) => p !== null);
  }

  render() {
    const productsToRender = this.getGroupedProducts();

    if (productsToRender.length === 0) {
      this.element.innerHTML =
        '<li class="cart__empty">Ваш кошик порожній</li>';
      this.#updateTotalPrice(0);
      return;
    }

    this.element.innerHTML = productsToRender
      .map((product) => this.template(product))
      .join('');

    const total = productsToRender.reduce(
      (sum, p) => sum + p.totalItemPrice,
      0,
    );
    this.#updateTotalPrice(total);
  }

  template(product) {
    const { id, image, model, price, category, count } = product;

    // Блокируем кнопки, если достигнуты лимиты
    const isMin = count <= this.settings.minQuantity;
    const isMax = count >= this.settings.maxQuantity;

    return `
      <li class="cart__item cart-item" data-product-id="${id}">
        <a href="/card.html?id=${id}" class="cart-item__image">
          <img src="${image}" alt="${model}" />
        </a>
        <div class="cart-item__info">
          <h3 class="cart-item__name">${model}</h3>
          <p class="cart-item__category">${category || 'Окуляри'}</p>
        </div>
        <div class="cart-item__actions">
          <div class="cart-item__quantity quantity">
            <button type="button" data-cart-minus 
                    class="quantity__button quantity__button--minus" 
                    ${isMin ? 'disabled' : ''}>-</button>
            <input type="number" class="quantity__input" value="${count}" readonly />
            <button type="button" data-cart-plus 
                    class="quantity__button quantity__button--plus" 
                    ${isMax ? 'disabled' : ''}>+</button>
          </div>
          <div class="cart-item__price-block">
            <span class="cart-item__price">${this.formatter.format(price * count)} грн</span>
          </div>
          <button type="button" data-cart-remove-btn class="cart-item__delete" aria-label="Видалити товар">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.8333 4.16666L4.16666 15.8333" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M4.16666 4.16666L15.8333 15.8333" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>
      </li>`;
  }

  initEventListeners() {
    this.element.addEventListener('click', (e) => {
      const productCard = e.target.closest('[data-product-id]');
      if (!productCard) {
        return;
      }

      const productId = Number(productCard.dataset.productId);
      const currentCount = this.storage
        .get()
        .filter((id) => id === productId).length;

      // 1. Плюс (с проверкой MAX)
      if (e.target.closest('[data-cart-plus]')) {
        if (currentCount < this.settings.maxQuantity) {
          this.storage.add(productId);
        }
      }

      // 2. Минус (с проверкой MIN)
      if (e.target.closest('[data-cart-minus]')) {
        if (currentCount > this.settings.minQuantity) {
          this.storage.removeOne(productId);
        }
      }

      // 3. Удаление по крестику
      if (e.target.closest('[data-cart-remove-btn]')) {
        this.storage.remove(productId); // Полностью удаляет все вхождения ID
      }
    });
  }

  #updateTotalPrice(total) {
    this.totalPriceElements.forEach((el) => {
      el.textContent = this.formatter.format(total);
    });
  }
}
