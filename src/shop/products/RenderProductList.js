import ProductCard from '../product-card/ProductCard';

export default class RenderProductList {
  // Настройки для списка (можно расширять)
  defaultSettings = {
    emptyClass: 'products__empty',
  };

  defaultI18n = {
    emptyMessage: 'Товари не знайдено',
  };

  constructor(containerSelector, products = [], storage = {}, options = {}) {
    this.container = document.querySelector(containerSelector);
    this.products = products;
    this.cards = []; // Массив экземпляров ProductCard

    // Сохраняем хранилища (cart и favorite)
    this.storage = storage;

    // Слияние настроек
    this.settings = { ...this.defaultSettings, ...options.settings };
    this.i18n = { ...this.defaultI18n, ...options.i18n };
  }

  /**
   * Рендерит список карточек
   * @param {Array} productsSlice - массив продуктов
   */
  render(productsSlice = this.products) {
    if (!this.container) {
      console.warn('Container for ProductList not found');
      return;
    }

    // 1. Очищаем старые карточки и удаляем их слушатели (память!)
    this.clear();

    if (productsSlice.length === 0) {
      this.container.innerHTML = `
        <li class="${this.settings.emptyClass}">${this.i18n.emptyMessage}</li>
      `;
      return;
    }

    // 2. DocumentFragment для производительности
    const fragment = document.createDocumentFragment();

    productsSlice.forEach((product) => {
      // ПЕРЕДАЕМ: продукт, объект с хранилищами и общие опции (если есть)
      const card = new ProductCard(product, this.storage);

      this.cards.push(card);
      fragment.append(card.render());
    });

    // 3. Один REFLOW вместо множества
    this.container.append(fragment);
  }

  /**
   * Обновляет исходный массив продуктов (например, после фильтрации)
   */
  updateProducts(products) {
    this.products = products || [];
  }

  /**
   * Полная очистка списка и вызов деструкторов карточек
   */
  clear() {
    if (!this.container) {
      return;
    }

    // Критически важно: вызываем destroy, чтобы убрать глобальные слушатели
    this.cards.forEach((card) => card.destroy());

    this.container.innerHTML = '';
    this.cards = [];
  }
}
