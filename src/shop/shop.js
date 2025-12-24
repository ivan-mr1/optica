import products from './products.json';
import PaginationCatalog from './pagination/PaginationCatalog';
import Cart from './Cart/Cart';

export default function shop() {
  new PaginationCatalog(products);
  new Cart();
}
