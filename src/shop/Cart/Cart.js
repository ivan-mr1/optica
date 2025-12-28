import { dom, selectors, stateClasses } from './cartDom.js';
import { saveCart, loadCart } from './cartStorage.js';
import { addProduct, removeProduct, restoreProducts } from './cartProducts.js';
import { handleCounterClick } from './cartCounter.js';
import { updateTotal } from './cartTotal.js';

const toggleCartStatus = () => {
  const hasItems = dom.cart.querySelector(selectors.cartItem);

  dom.cartOrder.classList.toggle(stateClasses.hidden, !hasItems);
  dom.cartEmpty.classList.toggle(stateClasses.hidden, hasItems);
};

const onChange = () => {
  toggleCartStatus();
  updateTotal();
  saveCart(dom.cartList);
};

export const initCart = () => {
  restoreProducts(loadCart());
  onChange();

  dom.productsList.addEventListener('click', (e) => addProduct(e, onChange));

  dom.cartList.addEventListener('click', (e) => {
    removeProduct(e, onChange);
    handleCounterClick(e, onChange);
  });
};
