import { selectors, dom } from './cartDom.js';

const formatter = new Intl.NumberFormat('ru');

export const updateTotal = () => {
  let total = 0;

  dom.cartList.querySelectorAll(selectors.cartItem).forEach((item) => {
    const count = item.querySelector(selectors.currentItems);
    const price = item.querySelector(selectors.cartPrice);

    const value = parseInt(count.textContent) * parseInt(price.dataset.price);

    price.textContent = formatter.format(value);
    total += value;
  });

  dom.totalPrice.textContent = formatter.format(total);
};
