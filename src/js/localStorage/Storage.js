export default class Storage {
  constructor(key) {
    this.STORAGE_KEY = key;
  }

  get() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? this.safeParse(data) : [];
  }

  set(value = []) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(value));
    } catch (error) {
      console.error(`Cannot save ${this.STORAGE_KEY}`, error);
    }
  }

  clear() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error(`Cannot clear ${this.STORAGE_KEY}`, error);
    }
  }

  syncWithProducts(products = []) {
    const data = this.get();

    const validData = data.filter((id) =>
      products.some((product) => product.id === Number(id)),
    );

    this.set(validData);
    return validData;
  }

  /* helpers */

  safeParse(value) {
    try {
      return JSON.parse(value);
    } catch {
      return [];
    }
  }
}
