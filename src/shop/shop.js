import products from './products.json';
import RenderProductList from './products/RenderProductList';
import Pagination from './pagination/Pagination';
import Storage from '../js/localStorage/Storage';
import FavoriteDropdown from './favorite/FavoriteDropdown';
import FavoriteList from './favorite/FavoriteList';
import CounterStorage from './CounterStorage/CounterStorage';

export default function shop() {
  const favStorage = new Storage('user_favorites');
  // const cartStorage = new Storage('user_cart');
  // 1. Каталог
  const productList = new RenderProductList(
    '[data-products-catalog]',
    products,
  );
  new Pagination(productList, products);

  // 2. Логика списка и открытия
  const favoriteDropdown = new FavoriteDropdown();
  const favoriteUI = new FavoriteList(favStorage, products);

  // 4. Подписки на события
  document
    .querySelector('[data-favorite]')
    ?.addEventListener('favorite:opened', () => {
      favoriteUI.render();
    });

  document.addEventListener('favorite:updated', () => {
    // Если меню открыто — перерисовываем. Если закрыто — Counter всё равно обновится,
    // так как FavoriteList.render() вызывается при открытии.
    if (favoriteDropdown.isOpen) {
      favoriteUI.render();
    }
  });

  // 1. Счетчик для избранного
  // Он будет следить за favStorage и обновляться по событию 'favorite:updated'
  new CounterStorage('[data-favorite-counter]', favStorage, 'favorite:updated');

  // 2. Счетчик для корзины (пример на будущее)
  // Он будет считать всё из cartStorage по событию 'cart:updated'
  // new CounterStorage('[data-cart-counter]', cartStorage, 'cart:updated');
}
