import products from './products.json';
import PaginationCatalog from './pagination/PaginationCatalog';
import Cart from './Cart/Cart';
import FavoriteDropdown from './favorite/FavoriteDropdown';
import counter from '../components/counter-icon/counter';

export default function shop() {
  new PaginationCatalog(products);
  new Cart();
  new FavoriteDropdown();
  counter('[data-favorite-counter]', '[data-favorite-list]');
  counter('[data-cart-counter]', '[data-cart-list]');
}
