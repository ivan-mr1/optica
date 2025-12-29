import ProductCard from '../product-card/ProductCard';

export default class RenderProductList {
  constructor(containerSelector, products = []) {
    this.container = document.querySelector(containerSelector);
    this.products = products;
  }

  render(productsSlice) {
    if (!this.container) {
      return;
    }

    this.container.innerHTML = '';

    productsSlice.forEach((product) => {
      const card = new ProductCard(product);
      this.container.append(card.render());
    });
  }

  updateProducts(products) {
    this.products = products || [];
  }
}
