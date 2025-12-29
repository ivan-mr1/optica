import products from './products.json';
import RenderProductList from './products/RenderProductList';
import Pagination from './pagination/Pagination';
import { initCart } from './cart/cart';
import counter from '../components/counter-icon/counter';

export default function shop() {
  const productList = new RenderProductList(
    '[data-products-catalog]',
    products,
  );
  new Pagination(productList, products);
  initCart();
  counter('[data-favorite-counter]', '[data-favorite-list]');
}
