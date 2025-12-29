export function renderProductsInFavorite(arr, parent) {
  if (!parent) {
    return;
  }

  arr.forEach((card) => {
    const { id, image, model, price, article } = card;

    const cardItem = `
      <article
        data-favorite-product
        class="favorite__product favorite-product"
        data-product-id="${id}"
      >
        <a href="/card.html?id=${id}" 
          target="_blank" 
          class="favorite-product__image">
          <img
            src="${image}"
            alt="${model}"
            class="favorite-product__img"
            width="100"
            height="100"
            loading="lazy"
          />
        </a>
        <div class="favorite-product__wrapper">
          <a
            href="/card.html?id=${id}"
            target="_blank"
            class="favorite-product__title"
            >${model}</a
          >
          <div class="favorite-product__inner">
            <div class="favorite-product__article">Art: ${article}</div>
            <div class="favorite-product__price" data-price="${price}">
              ${price} грн
            </div>
          </div>
        </div>
        <div class="favorite-product__buttons">
          <button
            data-favorite-remove-btn
            class="favorite-product__btn favorite-product__delete"
            aria-label="Видалити товар"
            title="Видалити товар"
          >
            <img
              src="assets/img/svg/trash.svg"
              alt="Image"
              height="20"
              width="20"
              loading="lazy"
            />
          </button>
          <button
            data-favorite-buy-btn
            class="favorite-product__btn favorite-product__cart"
            aria-label="Купити товар"
            title="Купити товар"
          >
            <img
              src="assets/img/svg/card.svg"
              alt="Image"
              height="20"
              width="20"
              loading="lazy"
            />
          </button>
        </div>
      </article>
    `;

    parent.insertAdjacentHTML('beforeend', cardItem);
  });
}
