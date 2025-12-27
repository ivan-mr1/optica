// only open or close favorite
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
    this.bindToggle();
    this.bindEscClose();
    this.bindClickOutside();
  }

  bindToggle() {
    this.button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggle();
    });
  }

  bindEscClose() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.close();
      }
    });
  }

  bindClickOutside() {
    document.addEventListener('click', (e) => {
      if (!this.root.contains(e.target)) {
        this.close();
      }
    });
  }

  open() {
    this.root.classList.add(this.stateClasses.active);
  }

  close() {
    this.root.classList.remove(this.stateClasses.active);
  }

  toggle() {
    this.root.classList.toggle(this.stateClasses.active);
  }
}
