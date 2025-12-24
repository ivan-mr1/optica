export default class ProductCard {
  selectors = {
    root: '.js-product',
    buyButton: '.js-buy-button',
    favoriteButton: '.js-favorite-product',
    shareButton: '.js-share-product',
  };

  stateClasses = {
    favorite: 'product--favorite',
  };

  constructor(product) {
    this.product = product;
    this.element = null;

    this.render();
    this.bindEvents();
  }

  render() {
    const li = document.createElement('li');
    li.classList.add('products__item', 'js-product');

    li.innerHTML = this.getTemplate();

    this.element = li;
  }

  getTemplate() {
    const {
      id,
      model,
      photos,
      price,
      oldPrice,
      rating,
      reviews,
      article,
      stock,
      isSale,
      isNew,
    } = this.product;

    return `
      <article class="product js-link-card" id="${id}">
        ${this.getImagesHTML(photos)}
        ${this.getActionsHTML(isSale, isNew)}
        ${this.getTitleHTML(model)}
        ${this.getPropsHTML(id, rating, reviews)}
        ${this.getInfoHTML(article, stock)}
        ${this.getPriceHTML(price, oldPrice)}
        <button class="button button--card product__btn js-buy-button">
          Add to cart
        </button>
      </article>
    `;
  }

  getImagesHTML(photos = []) {
    const safePhotos = photos.length ? photos : ['assets/img/san-glass/1.webp'];

    const items = safePhotos
      .map(
        (src) => `
          <div class="image-switch__item">
            <div class="image-switch__image">
              <img class="image-switch__img js-image-card" src="${src}" alt="product photo">
            </div>
          </div>
        `,
      )
      .join('');

    return `
      <a href="#" class="product__image">
        <div class="product__switch image-switch">
          ${items}
        </div>
        <ul class="product__image-pagination image-pagination" aria-hidden="true"></ul>
      </a>
    `;
  }

  getActionsHTML(isSale, isNew) {
    return `
      <div class="product__actions">
        <div class="product__links">
          <a href="#" class="product__link product__link_share js-share-product">Share</a>
          <a href="#" class="product__link product__link_favorite js-favorite-product">Like</a>
        </div>
        ${this.getLabelsHTML(isSale, isNew)}
      </div>
    `;
  }

  getLabelsHTML(isSale, isNew) {
    if (!isSale && !isNew) {
      return '';
    }

    return `
      <div class="product__labels">
        ${isSale ? '<div class="product__label product__label_sale">-30%</div>' : ''}
        ${isNew ? '<div class="product__label product__label_new">New</div>' : ''}
      </div>
    `;
  }

  getTitleHTML(model) {
    return `
      <h3 class="product__title js-title-card">
        <a href="#">${model}</a>
      </h3>
    `;
  }

  getPropsHTML(id, rating, reviews) {
    return `
      <div class="product__props">
        ${this.getRatingHTML(id, rating)}
        <span class="product__testimonials">${reviews} reviews</span>
      </div>
    `;
  }

  getRatingHTML(id, rating = 3) {
    return `
      <div class="product__rating simple-rating">
        <div class="simple-rating__items">
          ${[5, 4, 3, 2, 1]
            .map(
              (value) => `
                <input
                  id="simple-rating__${value}-${id}"
                  type="radio"
                  class="simple-rating__item"
                  name="simple-rating-${id}"
                  value="${value}"
                  ${value === rating ? 'checked' : ''}
                >
                <label
                  for="simple-rating__${value}-${id}"
                  class="simple-rating__label"
                ></label>
              `,
            )
            .join('')}
        </div>
      </div>
    `;
  }

  getInfoHTML(article, stock) {
    return `
      <div class="product__info">
        <div class="product__article">Article: ${article}</div>
        <div class="product__stock">in stock: ${stock} pcs</div>
      </div>
    `;
  }

  getPriceHTML(price, oldPrice) {
    return `
      <div class="product__price product-price">
        <div class="product-price__current js-price-card">${price} $</div>
        ${
          oldPrice
            ? `<div class="product-price__old js-price-card-old">${oldPrice} $</div>`
            : ''
        }
      </div>
    `;
  }

  bindEvents() {
    this.element
      .querySelector(this.selectors.buyButton)
      .addEventListener('click', this.onBuyClick);

    this.element
      .querySelector(this.selectors.favoriteButton)
      .addEventListener('click', this.onFavoriteClick);
  }

  onBuyClick = (e) => {
    e.preventDefault();
    console.error('Add to cart:', this.product.id);
  };

  onFavoriteClick = (e) => {
    e.preventDefault();
    this.element.classList.toggle(this.stateClasses.favorite);
  };
}
