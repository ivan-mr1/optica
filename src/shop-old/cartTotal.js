import { dom, selectors } from './cartDom.js';

const formatter = new Intl.NumberFormat('ru');

export const updateTotal = () => {
  let total = 0;

  const items = dom.cartList.querySelectorAll(selectors.cartItem);
  items.forEach((item) => {
    const countEl = item.querySelector(selectors.currentItems);
    const priceEl = item.querySelector(selectors.cartPrice);

    const count = parseInt(countEl.textContent, 10) || 1;
    const price = parseInt(priceEl.dataset.price, 10) || 0;

    const value = count * price;
    priceEl.textContent = formatter.format(value);
    total += value;
  });

  dom.totalPrice.textContent = formatter.format(total);
};
