import products from './products.json';
import PaginationCatalog from './pagination/PaginationCatalog';
import { initCart } from './cart/cart';
import FavoriteDropdown from './favorite/FavoriteDropdown';
import counter from '../components/counter-icon/counter';

export default function shop() {
  new PaginationCatalog(products);
  initCart();
  new FavoriteDropdown();
  counter('[data-favorite-counter]', '[data-favorite-list]');
}
