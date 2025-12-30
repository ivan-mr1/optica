import Storage from '../localStorage/Storage';
import CounterUI from '../UI/CounterUI';

export default class ItemsController {
  constructor({ storageKey, counterSelector }) {
    this.storage = new Storage(storageKey);
    this.ui = new CounterUI(counterSelector);

    this.init();
  }

  init() {
    const data = this.storage.get();
    this.ui.update(data.length);
  }

  add(id) {
    const data = this.storage.get();

    if (!data.includes(id)) {
      data.push(id);
      this.storage.set(data);
      this.ui.update(data.length);
    }
  }

  remove(id) {
    const data = this.storage.get().filter((itemId) => itemId !== id);

    this.storage.set(data);
    this.ui.update(data.length);
  }

  clear() {
    this.storage.clear();
    this.ui.update(0);
  }

  sync(products) {
    const data = this.storage.syncWithProducts(products);
    this.ui.update(data.length);
  }
}
