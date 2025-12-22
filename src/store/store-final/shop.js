import products from './products.json';
import { productImagePagination } from './productImagePagination.js';
import { paginate } from './paginatiion.js';
// import { cartData } from './cartData.js';

export default function shop() {
  // const productContainer = document.querySelector('[data-products-catalog]'); //массив с карточками товаров
  productImagePagination();
  paginate(products);
  // cartData();
}
