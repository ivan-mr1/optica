import products from './Products.js';
import ProductCard from './ProductCard.js';

export default class Portfolio {
  selectors = {
    root: '[data-products-catalog]',
  };

  constructor() {
    this.root = document.querySelector(this.selectors.root);

    if (!this.root) {
      return;
    }

    this.renderProjects();
  }

  renderProjects() {
    this.root.innerHTML = '';

    products.forEach((project) => {
      const card = new ProductCard(project);
      this.root.append(card.renderElement());
    });
  }
}
