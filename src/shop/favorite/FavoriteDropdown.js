export default class FavoriteDropdown {
  selectors = {
    root: '[data-favorite]',
    button: '[data-favorite-btn]',
    content: '.favorite__content',
  };

  stateClasses = {
    active: 'is-active',
  };

  constructor() {
    this.root = document.querySelector(this.selectors.root);
    if (!this.root) {
      return;
    }

    this.button = this.root.querySelector(this.selectors.button);
    this.content = this.root.querySelector(this.selectors.content);

    this.bindEvents();
  }

  bindEvents() {
    this.button.addEventListener('click', this.handleToggle);
    document.addEventListener('keydown', this.handleEscClose);
    document.addEventListener('click', this.handleClickOutside);
  }

  handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.toggle();
  };

  handleEscClose = (e) => {
    if (e.key === 'Escape' && this.isOpen) {
      this.close();
    }
  };

  handleClickOutside = (e) => {
    if (!this.root.contains(e.target) && this.isOpen) {
      this.close();
    }
  };

  // Геттер для удобной проверки состояния
  get isOpen() {
    return this.root.classList.contains(this.stateClasses.active);
  }

  open() {
    this.root.classList.add(this.stateClasses.active);
    // Генерируем событие, чтобы другие компоненты знали, что меню открыто
    this.root.dispatchEvent(new CustomEvent('favorite:opened'));
  }

  close() {
    if (!this.isOpen) {
      return;
    }
    this.root.classList.remove(this.stateClasses.active);
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  destroy() {
    this.button.removeEventListener('click', this.handleToggle);
    document.removeEventListener('keydown', this.handleEscClose);
    document.removeEventListener('click', this.handleClickOutside);
  }
}
