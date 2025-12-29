import products from './products.json';
import RenderProductList from './products/RenderProductList';
import Pagination from './pagination/Pagination';

export default function shop() {
  const productList = new RenderProductList(
    '[data-products-catalog]',
    products,
  );
  new Pagination(productList, products);
}
