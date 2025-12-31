import products from './products.json';
import RenderProductList from './products/RenderProductList';
import Pagination from './pagination/Pagination';
import Storage from '../js/localStorage/Storage';
import FavoriteDropdown from './favorite/FavoriteDropdown';
import FavoriteList from './favorite/FavoriteList';
import CounterStorage from './CounterStorage/CounterStorage';
import CartList from './cart/CartList';

export default function shop() {
  // 1. Инициализируем хранилища
  const favStorage = new Storage('user_favorites', 'favorite:updated');
  const cartStorage = new Storage('user_cart', 'cart:updated');

  // 2. Каталог
  const productList = new RenderProductList(
    '[data-products-catalog]',
    products,
    { favorite: favStorage, cart: cartStorage },
  );

  // 3. Пагинация
  // Она сама вызовет productList.render() для первой страницы при создании
  new Pagination(productList, products, {
    productsPerPage: 12,
    visibleRange: 2,
  });

  // 4. Избранное и выпадающий список
  new FavoriteDropdown();
  new FavoriteList(favStorage, products, cartStorage);

  // 5. Корзина
  new CartList(cartStorage, products);

  // 6. Счетчики в шапке
  new CounterStorage('[data-favorite-counter]', favStorage, 'favorite:updated');
  new CounterStorage('[data-cart-counter]', cartStorage, 'cart:updated');
}
