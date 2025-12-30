class Header {
  selectors = {
    root: '[data-header]',
    menu: '[data-header-menu]',
    burgerButton: '[data-header-burger-btn]',
    overlay: '.header__overlay',
  };

  stateClasses = {
    isActive: 'is-active',
    isLock: 'lock',
  };

  constructor() {
    this.rootElement = document.querySelector(this.selectors.root);
    if (!this.rootElement) {
      return;
    }

    this.menuElement = this.rootElement.querySelector(this.selectors.menu);
    this.burgerButtonElement = this.rootElement.querySelector(
      this.selectors.burgerButton,
    );
    this.overlayElement = this.rootElement.querySelector(
      this.selectors.overlay,
    );

    this.bindEvents();

    this.setHeightProperty();
  }

  setHeightProperty = () => {
    const height = this.rootElement.offsetHeight;
    document.documentElement.style.setProperty(
      '--header-height',
      `${height}px`,
    );
  };

  updateAccessibility(isOpen) {
    this.burgerButtonElement.setAttribute('aria-expanded', isOpen);
    document.body.classList.toggle(this.stateClasses.isLock, isOpen);
  }

  openMenu() {
    this.burgerButtonElement.classList.add(this.stateClasses.isActive);
    this.menuElement.classList.add(this.stateClasses.isActive);
    this.updateAccessibility(true);
    document.addEventListener('keydown', this.onEscapePress);
  }

  closeMenu() {
    this.burgerButtonElement.classList.remove(this.stateClasses.isActive);
    this.menuElement.classList.remove(this.stateClasses.isActive);
    this.updateAccessibility(false);
    document.removeEventListener('keydown', this.onEscapePress);
  }

  toggleMenu = () => {
    const isOpen = this.menuElement.classList.contains(
      this.stateClasses.isActive,
    );
    isOpen ? this.closeMenu() : this.openMenu();
  };

  onEscapePress = (e) => {
    if (e.key === 'Escape') {
      this.closeMenu();
    }
  };

  onOverlayClick = (e) => {
    if (e.target === this.overlayElement) {
      this.closeMenu();
    }
  };

  onMenuClick = (event) => {
    const target = event.target;
    if (target.closest('a') || target.closest('button')) {
      this.closeMenu();
    }
  };

  bindEvents() {
    if (!this.burgerButtonElement || !this.menuElement) {
      return;
    }

    this.burgerButtonElement.addEventListener('click', this.toggleMenu);
    this.menuElement.addEventListener('click', this.onMenuClick);

    window.addEventListener('resize', this.setHeightProperty);

    if (this.overlayElement) {
      this.overlayElement.addEventListener('click', this.onOverlayClick);
    }
  }

  destroy() {
    this.burgerButtonElement.removeEventListener('click', this.toggleMenu);
    this.menuElement.removeEventListener('click', this.onMenuClick);
    document.removeEventListener('keydown', this.onEscapePress);
    window.removeEventListener('resize', this.setHeightProperty);
  }
}

export default Header;
