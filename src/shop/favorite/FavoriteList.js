export default class FavoriteList {
  selectors = {
    list: '[data-favorite-list]',
    totalPrice: '.favorite__fullprice',
  };

  constructor(storage, allProducts) {
    this.storage = storage;
    this.allProducts = allProducts;
    this.element = document.querySelector(this.selectors.list);
    this.totalPriceElement = document.querySelector(this.selectors.totalPrice);
    this.formatter = new Intl.NumberFormat('uk-UA');

    this.initEventListeners();
  }

  render() {
    if (!this.element) {
      return;
    }

    const favIds = this.storage.get();
    const productsToRender = this.allProducts.filter(
      (p) => favIds.includes(String(p.id)) || favIds.includes(Number(p.id)),
    );

    this.element.innerHTML = '';

    if (productsToRender.length === 0) {
      this.element.innerHTML =
        '<li class="favorite__empty">Ваш список порожній</li>';
      this.#updateTotalPrice(0);
    } else {
      const html = productsToRender
        .map((product) => this.template(product))
        .join('');
      this.element.innerHTML = html;

      const total = productsToRender.reduce(
        (sum, p) => sum + Number(p.price),
        0,
      );
      this.#updateTotalPrice(total);
    }
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
              <img src="assets/img/svg/trash.svg" alt="Trash" height="18" width="18" />
            </button>
            <button data-favorite-buy-btn class="favorite-product__btn favorite-product__cart" title="В кошик">
              <img src="assets/img/svg/card.svg" alt="Cart" height="18" width="18" />
            </button>
          </div>
        </article>
      </li>`;
  }

  initEventListeners() {
    if (!this.element) {
      return;
    }

    this.element.addEventListener('click', (e) => {
      const removeBtn = e.target.closest('[data-favorite-remove-btn]');
      const productCard = e.target.closest('[data-product-id]');

      if (removeBtn && productCard) {
        const productId = productCard.dataset.productId;
        this.storage.remove(productId);
        this.render(); // После этого MutationObserver в Counter сработает сам!

        document.dispatchEvent(new CustomEvent('favorite:updated'));
      }
    });
  }

  #updateTotalPrice(total) {
    if (this.totalPriceElement) {
      this.totalPriceElement.textContent = `${this.formatter.format(total)} грн`;
    }
  }
}
