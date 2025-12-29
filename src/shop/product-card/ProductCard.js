export default class ProductCard {
  constructor(product) {
    if (!product || typeof product !== 'object') {
      throw new Error('Invalid product data');
    }

    this.product = product;
    this.element = null;
  }

  render() {
    if (!this.element) {
      const li = document.createElement('li');
      li.classList.add('products__item', 'js-product');
      li.innerHTML = this.getTemplate();
      this.element = li;
    }
    return this.element;
  }

  getTemplate() {
    const { id, image, model, description, article, price } = this.product;

    return `
      <article data-card-link class="product" data-product-id="${id}">
        <a href="/card.html?id=${id}" 
          target="_blank" 
          class="product__image ibg">
          <img
            src="${image}"
            alt="${model}"
            data-card-image
            width="285"
            height="215"
            loading="lazy"
          />
        </a>

        <div class="product__bottom">
          <div class="product__actions">
            <button
              type="button"
              data-card-favorite
              class="product__link product__link-favorite"
            >
              <img
                src="assets/img/svg/favorite-card.svg"
                alt="Image"
                width="24"
                height="21"
                loading="lazy"
              />
            </button>
          </div>
          <a
            href="/card.html?id=${id}"
            target="_blank"
            data-card-title
            class="product__title"
            >${model}</a
          >
          <div class="product__descr">
            <p>${description}</p>
          </div>
          <div data-card-article class="product__article">Article: ${article}</div>
          <div class="product__price product-price">
            <div data-card-price class="product__price-current">${price} грн</div>
          </div>
          <button
            data-card-buy-btn
            class="button button--card product__btn js-buy-button"
          >
            До кошика
          </button>
        </div>
      </article>
    `;
  }
}
