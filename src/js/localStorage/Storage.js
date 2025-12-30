export default class Storage {
  constructor(key, eventName) {
    this.STORAGE_KEY = key;
    this.EVENT_NAME = eventName;
    this.initTabSync();
  }

  // Следит за изменениями в localStorage из других вкладок и обновляет текущую
  initTabSync() {
    window.addEventListener('storage', (e) => {
      if (e.key === this.STORAGE_KEY && this.EVENT_NAME) {
        this.#notify();
      }
    });
  }

  // Создает кастомное событие для мгновенного обновления интерфейса
  #notify() {
    if (this.EVENT_NAME) {
      document.dispatchEvent(new CustomEvent(this.EVENT_NAME));
    }
  }

  // Извлекает данные из localStorage и возвращает массив
  get() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? this.safeParse(data) : [];
    } catch (e) {
      console.error('LocalStorage Get Error:', e);
      return [];
    }
  }

  // Проверяет, содержится ли конкретный ID в хранилище (возвращает true/false)
  check(id) {
    const data = this.get();
    return data.includes(Number(id));
  }

  // Записывает массив данных в localStorage и уведомляет систему об изменениях
  set(value = []) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(value));
      this.#notify();
    } catch (error) {
      console.error(`Storage Error: Cannot save ${this.STORAGE_KEY}`, error);
    }
  }

  // Добавляет ID в конец массива (разрешает дубликаты для корзины)
  add(id) {
    const data = this.get();
    data.push(Number(id));
    this.set(data);
  }

  // Находит и удаляет только первое совпадение ID (уменьшает количество на 1)
  removeOne(id) {
    const numericId = Number(id);
    const data = this.get();
    const index = data.indexOf(numericId);

    if (index !== -1) {
      data.splice(index, 1);
      this.set(data);
    }
  }

  // Удаляет все вхождения данного ID из массива (полная очистка товара)
  remove(id) {
    const numericId = Number(id);
    const data = this.get().filter((item) => Number(item) !== numericId);
    this.set(data);
  }

  // Добавляет ID, если его нет, и удаляет, если он уже присутствует
  toggle(id) {
    const numericId = Number(id);
    const data = this.get();
    const index = data.indexOf(numericId);

    if (index === -1) {
      data.push(numericId);
    } else {
      data.splice(index, 1);
    }

    this.set(data);
    return data;
  }

  // Полностью удаляет ключ из localStorage и обновляет состояние системы
  clear() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.#notify();
  }

  // Проверяет строку на валидный JSON и всегда возвращает массив
  safeParse(value) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
}
