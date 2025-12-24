import products from './products.json';
import PaginationCatalog from './PaginationCatalog';

export default function shop() {
  new PaginationCatalog(products);
}
