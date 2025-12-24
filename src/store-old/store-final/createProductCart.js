const createProductCard = ({ id, photo, model, prices }) => {
  const random1to100 = Math.floor(Math.random() * 100) + 1;
  const random1to300 = Math.floor(Math.random() * (300 - 80 + 1)) + 80;
  const random100to350 = Math.floor(Math.random() * (350 - 100 + 1)) + 100;
  const random100to450 = Math.floor(Math.random() * (450 - 100 + 1)) + 100;

  const currentPrice = prices?.[0] || random1to300;
  const oldPrice = Math.round(currentPrice * 1.3);

  const safePhotos =
    Array.isArray(photo) && photo.length > 0
      ? photo
      : ['assets/img/san-glass/1.webp'];

  const imageSwitchItems = safePhotos
    .filter(Boolean)
    .map(
      (imgSrc) => `
        <div class="image-switch__item">
          <div class="image-switch__image">
            <img class="image-switch__img js-image-card" src="${imgSrc}" alt="photo product">
          </div>
        </div>
      `,
    )
    .join('');

  const showSaleLabel = Math.random() < 0.6;
  const showNewLabel = Math.random() < 0.4;

  let labelsHTML = '<div class="product__labels">';
  if (showSaleLabel) {
    labelsHTML +=
      '<div class="product__label product__label_sale js-label-sale">-30%</div>';
  }
  if (showNewLabel) {
    labelsHTML +=
      '<div class="product__label product__label_new js-label-new">New</div>';
  }
  labelsHTML += '</div>';

  const li = document.createElement('li');
  li.classList.add('products__item', 'js-product');

  li.innerHTML = `
    <article class="product js-link-card" id="${id}">
      <a href="#" class="product__image">
        <div class="product__switch image-switch">
          ${imageSwitchItems}
        </div>
        <ul class="product__image-pagination image-pagination" aria-hidden="true"></ul>
      </a>
      <div class="product__actions">
        <div class="product__links">
          <a href="#" class="product__link product__link_share js-share-product">Share</a>
          <a href="#" class="product__link product__link_favorite js-favorite-product">Like</a>
        </div>
        ${labelsHTML}
      </div>      
      <h3 class="product__title js-title-card">
        <a href="#">${model}</a>
      </h3>      
      <div class="product__props">
        <div class="product__rating simple-rating">
          <div class="simple-rating__items">
            <input id="simple-rating__5-${id}" type="radio" class="simple-rating__item" name="simple-rating-${id}" value="5">
            <label for="simple-rating__5-${id}" class="simple-rating__label"></label>
            <input id="simple-rating__4-${id}" type="radio" class="simple-rating__item" name="simple-rating-${id}" value="4">
            <label for="simple-rating__4-${id}" class="simple-rating__label"></label>
            <input id="simple-rating__3-${id}" type="radio" class="simple-rating__item" checked name="simple-rating-${id}" value="3">
            <label for="simple-rating__3-${id}" class="simple-rating__label"></label>
            <input id="simple-rating__2-${id}" type="radio" class="simple-rating__item" name="simple-rating-${id}" value="2">
            <label for="simple-rating__2-${id}" class="simple-rating__label"></label>
            <input id="simple-rating__1-${id}" type="radio" class="simple-rating__item" name="simple-rating-${id}" value="1">
            <label for="simple-rating__1-${id}" class="simple-rating__label"></label>
          </div>
        </div>
        <span class="product__testimonials">${random100to350} reviews</span>
      </div>
      <div class="product__info">
        <div class="product__article">Article: ${random100to450}</div>
        <div class="product__stock">in stock: ${random1to100} pcs</div>
      </div>
      <div class="product__price product-price">
        <div class="product-price__current js-price-card">${currentPrice} $</div>
        <div class="product-price__old js-price-card-old">${oldPrice} $</div>
      </div>
      <button class="button button--card product__btn js-buy-button">Add to cart</button>
    </article>
  `;

  return li;
};

export default createProductCard;
