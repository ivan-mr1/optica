import { dom, selectors, stateClasses } from './cartDom.js';

export const getProductInfo = (product) => ({
  id: product.querySelector('[data-card-link]').id,
  model: product.querySelector('[data-card-title]').textContent,
  price: parseInt(
    product.querySelector('[data-card-price]').textContent.replace(/\s/g, ''),
    10,
  ),
  image: product.querySelector('[data-card-image]')?.src,
  count: 1,
});

export const renderProduct = (product) => {
  const li = document.createElement('li');
  li.className = 'cart__item item-cart js-cart-item';

  li.innerHTML = `
    <span class="close js-remove"></span>
    <div class="item-cart__wrapper" id="${product.id}">
      <div class="item-cart__model">${product.model}</div>
      <div class="item-cart__image">
        <img src="${product.image}" alt="${product.model}">
      </div>

      <div class="item-cart__counter">
        <div class="stapper js-counter">
          <button type="button"
            class="stapper__button js-minus ${stateClasses.disabled}">
            –
          </button>
          <div class="stapper__number js-current-items">
            ${product.count}
          </div>
          <button type="button" class="stapper__button js-plus">+</button>
        </div>

        <div class="item-cart__price">
          <span
            class="item-cart__price-counter js-cart-price"
            data-price="${product.price}">
            ${product.price}
          </span>
          <span class="item-cart__currency">грн</span>
        </div>
      </div>
    </div>
  `;

  dom.cartList.appendChild(li);
};

export const addProduct = (e, onChange) => {
  if (!e.target.classList.contains(selectors.buyButton.slice(1))) {
    return;
  }

  const product = e.target.closest('.js-product');
  const info = getProductInfo(product);

  const inCart = dom.cartList.querySelector(`#${info.id}`);
  if (inCart) {
    const countEl = inCart.querySelector(selectors.currentItems);
    const minusBtn = inCart.querySelector(selectors.minusButton);

    countEl.textContent = parseInt(countEl.textContent, 10) + 1;
    minusBtn.classList.remove(stateClasses.disabled);
  } else {
    renderProduct(info);
  }

  onChange();
};

export const removeProduct = (e, onChange) => {
  if (!e.target.classList.contains(selectors.removeButton.slice(1))) {
    return;
  }
  const item = e.target.closest(selectors.cartItem);
  if (item) {
    item.remove();
  }
  onChange();
};

export const restoreProducts = (items) => {
  if (!Array.isArray(items)) {
    return;
  }
  items.forEach(renderProduct);
};
