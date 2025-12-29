export default class Storage {
  constructor(key) {
    this.STORAGE_KEY = key;
  }

  /**
   * Получает массив данных из localStorage
   * @returns {Array<number>}
   */
  get() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? this.safeParse(data) : [];
  }

  /**
   * Сохраняет массив данных в localStorage
   * @param {Array<number>} value
   */
  set(value = []) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(value));
    } catch (error) {
      console.error(`Cannot save ${this.STORAGE_KEY}`, error);
    }
  }

  /**
   * Проверяет наличие ID в хранилище
   * @param {number|string} id
   * @returns {boolean}
   */
  check(id) {
    const numericId = Number(id);
    return this.get().some((item) => Number(item) === numericId);
  }

  /**
   * Переключает состояние ID (удаляет если есть, добавляет если нет)
   * @param {number|string} id
   * @returns {Array<number>} Обновленный массив
   */
  toggle(id) {
    const numericId = Number(id);
    const data = this.get().map((item) => Number(item));
    const index = data.indexOf(numericId);

    if (index === -1) {
      data.push(numericId);
    } else {
      data.splice(index, 1);
    }

    this.set(data);
    return data;
  }

  /**
   * Полностью очищает текущее хранилище
   */
  clear() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error(`Cannot clear ${this.STORAGE_KEY}`, error);
    }
  }

  /**
   * Синхронизирует хранилище с актуальным списком продуктов.
   * Удаляет ID, которых больше нет в базе (JSON).
   * @param {Array<Object>} products
   * @returns {Array<number>}
   */
  syncWithProducts(products = []) {
    const data = this.get();

    const validData = data
      .map((id) => Number(id))
      .filter((id) => products.some((product) => Number(product.id) === id));

    this.set(validData);
    return validData;
  }

  /* helpers */

  /**
   * Безопасно преобразует строку JSON в объект
   * @param {string} value
   * @returns {Array}
   */
  safeParse(value) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
}
