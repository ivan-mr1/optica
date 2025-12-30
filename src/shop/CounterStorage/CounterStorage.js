export default class CounterStorage {
  constructor(counterSelector, storage, eventName) {
    this.counter = document.querySelector(counterSelector);
    this.storage = storage; // Экземпляр класса Storage
    this.eventName = eventName; // Например, 'favorite:updated' или 'cart:updated'

    if (!this.counter || !this.storage) {
      return;
    }

    this.init();
  }

  init() {
    // 1. Первоначальный расчет при загрузке
    this.update();

    // 2. Слушаем глобальное событие обновления данных
    document.addEventListener(this.eventName, () => {
      this.update();
    });
  }

  update() {
    // Получаем массив всех ID из хранилища
    const items = this.storage.get();

    // Считаем общее количество.
    // Если в массиве [1, 2, 2, 3], то count будет 4.
    const count = items.length;

    this.counter.textContent = count;

    // Управляем видимостью (класс из твоих стилей)
    if (count > 0) {
      this.counter.classList.remove('is-hidden');
    } else {
      this.counter.classList.add('is-hidden');
    }
  }
}
