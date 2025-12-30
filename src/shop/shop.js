import products from './products.json';
import RenderProductList from './products/RenderProductList';
import Pagination from './pagination/Pagination';
import Storage from '../js/localStorage/Storage';
import FavoriteDropdown from './favorite/FavoriteDropdown';
import FavoriteList from './favorite/FavoriteList';
import CounterStorage from './CounterStorage/CounterStorage';
import CartList from './cart/CartList';

export default function shop() {
  // Инициализируем хранилища
  const favStorage = new Storage('user_favorites', 'favorite:updated');
  const cartStorage = new Storage('user_cart', 'cart:updated');

  // 2. Каталог и Пагинация
  const productList = new RenderProductList(
    '[data-products-catalog]',
    products,
  );
  new Pagination(productList, products);

  // 3. Избранное
  new FavoriteDropdown();
  new FavoriteList(favStorage, products, cartStorage);

  // 4. Корзина (Добавляем инициализацию)
  // Передаем cartStorage и общую базу товаров products
  new CartList(cartStorage, products);

  // 5. Счетчики
  new CounterStorage('[data-favorite-counter]', favStorage, 'favorite:updated');
  new CounterStorage('[data-cart-counter]', cartStorage, 'cart:updated');
}
