import products from './products.json';
import PaginationCatalog from './pagination/PaginationCatalog';

export default function shop() {
  new PaginationCatalog(products);
}
