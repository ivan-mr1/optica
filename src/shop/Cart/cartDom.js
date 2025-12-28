export const selectors = {
  cart: '.js-cart',
  productsList: '[data-products-catalog]',
  cartList: '.js-cart-list',
  cartOrder: '.js-cart-order-container',
  cartEmpty: '.js-cart-empty-container',
  totalPrice: '.js-cart-total-price',

  buyButton: '.js-buy-button',
  removeButton: '.js-remove',
  plusButton: '.js-plus',
  minusButton: '.js-minus',

  cartItem: '.js-cart-item',
  counter: '.js-counter',
  currentItems: '.js-current-items',
  cartPrice: '.js-cart-price',
};

export const stateClasses = {
  hidden: 'hidden',
  disabled: 'disabled',
};

export const dom = {
  cart: document.querySelector(selectors.cart),
  productsList: document.querySelector(selectors.productsList),
  cartList: document.querySelector(selectors.cartList),
  cartOrder: document.querySelector(selectors.cartOrder),
  cartEmpty: document.querySelector(selectors.cartEmpty),
  totalPrice: document.querySelector(selectors.totalPrice),
};
