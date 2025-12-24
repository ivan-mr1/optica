const cart = document.querySelector('.js-cart');
const overlay = document.querySelector('.js-overlay');
const opencartButton = document.querySelector('.js-cart-btn');
const closeCartElements = document.querySelectorAll('.js-close-cart');

const getScrollbarWidth = () => {
  let div = document.createElement('div');
  div.style.width = '100px';
  div.style.height = '100px';
  div.style.overflowY = 'scroll';
  div.style.visibility = 'hidden';
  document.body.append(div);
  let scrollbarWidth = div.offsetWidth - div.clientWidth;
  div.remove;

  return scrollbarWidth;
};

const scroll = getScrollbarWidth();

const toggleCart = (isActive) => {
  document.body.style.overflow = isActive ? 'hidden' : '';
  document.body.style.marginRight = isActive ? `${scroll}px` : '0px';
  cart.classList.toggle('active', isActive);
  overlay.classList.toggle('active', isActive);
};

const openCart = () => {
  opencartButton.addEventListener('click', () => {
    toggleCart(true);
  });
};

const closeCart = () => {
  closeCartElements.forEach((item) => {
    item.addEventListener('click', () => {
      toggleCart(false);
    });
  });
};

export { openCart, closeCart };
