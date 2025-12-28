import { dom, selectors } from './cartDom.js';

export const collectCartState = () =>
  [...dom.cartList.querySelectorAll(selectors.cartItem)].map((item) => ({
    id: item.querySelector('.item-cart__wrapper').id,
    model: item.querySelector('.item-cart__model').textContent,
    image: item.querySelector('img')?.src,
    price: Number(item.querySelector(selectors.cartPrice).dataset.price),
    count: Number(item.querySelector(selectors.currentItems).textContent),
  }));
