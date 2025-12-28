export default class CounterUI {
  constructor(selector) {
    this.el = document.querySelector(selector);
  }

  update(count = 0) {
    if (!this.el) {
      return;
    }
    this.el.textContent = count;
    this.el.classList.toggle('is-hidden', count === 0);
  }
}
