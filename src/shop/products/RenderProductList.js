import ProductCard from '../product-card/ProductCard';

export default class RenderProductList {
  constructor(containerSelector, products = []) {
    this.container = document.querySelector(containerSelector);
    this.products = products;
    this.cards = []; // Массив экземпляров классов ProductCard
  }

  /**
   * Рендерит список карточек
   * @param {Array} productsSlice - массив продуктов (например, срез для пагинации)
   */
  render(productsSlice = this.products) {
    if (!this.container) {
      console.warn('Container not found');
      return;
    }

    // 1. Сначала очищаем старые карточки и их слушатели!
    this.clear();

    if (productsSlice.length === 0) {
      this.container.innerHTML =
        '<li class="products__empty">Товари не знайдено</li>';
      return;
    }

    // 2. Используем DocumentFragment для минимизации перерисовок DOM
    const fragment = document.createDocumentFragment();

    productsSlice.forEach((product) => {
      const card = new ProductCard(product);
      this.cards.push(card);

      // card.render() возвращает готовый элемент <li>
      fragment.append(card.render());
    });

    // 3. Вставляем всё в DOM одним махом
    this.container.append(fragment);
  }

  /**
   * Обновляет исходный массив продуктов
   */
  updateProducts(products) {
    this.products = products || [];
  }

  /**
   * Полная очистка списка с удалением слушателей событий
   */
  clear() {
    if (!this.container) {
      return;
    }

    // Вызываем destroy у каждой карточки, чтобы снять document.addEventListener
    this.cards.forEach((card) => {
      if (typeof card.destroy === 'function') {
        card.destroy();
      }
    });

    this.container.innerHTML = '';
    this.cards = [];
  }
}
