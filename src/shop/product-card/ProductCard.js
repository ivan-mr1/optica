export default class ProductCard {
  constructor(product) {
    this.product = product;
    this.element = null;

    this.render();
  }

  render() {
    const li = document.createElement('li');
    li.classList.add('products__item', 'js-product');

    li.innerHTML = this.getTemplate();

    this.element = li;
  }

  getTemplate() {
    const { id, image, model, description, article, price } = this.product;

    return `
      <article data-card-link 
               class="product" 
               id="${id}"
               data-product-id="${id}">
               
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
              <svg
                width="24"
                height="21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M12 18.023c-4.64-2.635-7.236-5.26-8.493-7.55C2.224 8.138 2.33 6.156 3.052 4.74c1.478-2.9 5.684-3.828 8.242-.593l.705.893.707-.893c2.558-3.235 6.764-2.307 8.242.593.721 1.415.827 3.398-.456 5.735-1.257 2.289-3.852 4.914-8.492 7.549zm0-15.778C8.52-1.144 3.337.215 1.448 3.922.42 5.939.4 8.555 1.93 11.34c1.517 2.763 4.548 5.69 9.634 8.502l.436.24.435-.24c5.086-2.811 8.118-5.74 9.635-8.502 1.53-2.785 1.51-5.4.482-7.418C20.662.215 15.48-1.144 12 2.245z"
                  fill="#e89f71"
                />
              </svg>
            </button>
          </div>

          <a href="/card.html?id=${id}" 
             target="_blank" 
             data-card-title 
             class="product__title">${model}</a>

          <div class="product__descr">
            <p>${description}</p>
          </div>

          <div data-card-article class="product__article">Article: ${article}</div>

          <div class="product__price product-price">
            <div data-card-price class="product__price-current">
              ${price} грн
            </div>
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
// image 474/355
