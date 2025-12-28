const STORAGE_KEY = 'cart';

export const saveCart = (cartList) => {
  const items = [];

  cartList.querySelectorAll('.js-cart-item').forEach((item) => {
    items.push({
      id: item.querySelector('.item-cart__wrapper').id,
      model: item.querySelector('.item-cart__model').textContent,
      image: item.querySelector('img')?.src,
      price: item.querySelector('.js-cart-price').dataset.price,
      count: parseInt(item.querySelector('.js-current-items').textContent),
    });
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export const loadCart = () =>
  JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

export const clearCart = () => {
  localStorage.removeItem(STORAGE_KEY);
};
