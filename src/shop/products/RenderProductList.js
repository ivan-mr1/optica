import ProductCard from '../product-card/ProductCard';

export default class RenderProductList {
  constructor(containerSelector, products = []) {
    this.container = document.querySelector(containerSelector);
    this.products = products;
    this.cards = []; // Сохраняем экземпляры карточек, если понадобится ими управлять
  }

  render(productsSlice = this.products) {
    if (!this.container) {
      console.warn('Container not found');
      return;
    }

    // 1. Очищаем контейнер
    this.container.innerHTML = '';
    this.cards = [];

    // 2. Используем DocumentFragment для производительности
    const fragment = document.createDocumentFragment();

    productsSlice.forEach((product) => {
      const card = new ProductCard(product);
      this.cards.push(card); // Сохраняем ссылку на объект карточки

      // Добавляем во фрагмент (это не трогает реальный DOM)
      fragment.append(card.render());
    });

    // 3. Вставляем всё в DOM одним махом
    this.container.append(fragment);
  }

  updateProducts(products) {
    this.products = products || [];
    // Можно сразу вызвать render, если нужно автоматическое обновление
    // this.render();
  }

  // Полезный метод для удаления списка и очистки памяти
  clear() {
    if (this.container) {
      this.container.innerHTML = '';
    }
    this.cards = [];
  }
}
