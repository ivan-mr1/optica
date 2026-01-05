import { bodyLock, bodyUnlock } from '../../js/function/bodyLock.js';

class Header {
  selectors = {
    root: '[data-header]',
    menu: '[data-header-menu]',
    burgerButton: '[data-header-burger-btn]',
    overlay: '[data-header-overlay]',
  };

  stateClasses = {
    isActive: 'is-active',
    isLock: 'lock',
    isScrolled: 'scroll',
    isHidden: 'is-hidden',
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

    this.isMenuOpen = false;
    this.lastScrollY = window.scrollY;

    this.init();
  }

  init() {
    this.setHeightProperty();
    this.handleScroll();
    this.bindEvents();

    this.resizeObserver = new ResizeObserver(() => this.setHeightProperty());
    this.resizeObserver.observe(this.rootElement);
  }

  setHeightProperty = () => {
    const height = this.rootElement.offsetHeight;
    document.documentElement.style.setProperty(
      '--header-height',
      `${height}px`,
    );
  };

  /**
   * Обработчик скролла страницы
   * Управляет видимостью и состоянием header при прокрутке
   */
  handleScroll = () => {
    const currentScrollY = window.scrollY;
    const headerHeight = this.rootElement.offsetHeight;
    const isScrollingDown = currentScrollY > this.lastScrollY;
    const isScrolledPastHeader = currentScrollY > headerHeight;

    // Добавляем класс при любом скролле
    this.rootElement.classList.toggle(
      this.stateClasses.isScrolled,
      currentScrollY > 0,
    );

    // Скрываем/показываем header при скролле вниз
    const shouldHideHeader =
      !this.isMenuOpen && isScrolledPastHeader && isScrollingDown;

    this.rootElement.classList.toggle(
      this.stateClasses.isHidden,
      shouldHideHeader,
    );

    this.lastScrollY = currentScrollY;
  };

  /**
   * Переключает состояние мобильного меню
   */
  toggleMenu = () => {
    this.isMenuOpen ? this.closeMenu() : this.openMenu();
  };

  /**
   * Открывает мобильное меню
   */
  openMenu = () => {
    this.isMenuOpen = true;
    this.burgerButtonElement?.classList.add(this.stateClasses.isActive);
    this.menuElement?.classList.add(this.stateClasses.isActive);
    this.burgerButtonElement?.setAttribute('aria-expanded', 'true');
    bodyLock();

    this.rootElement.classList.remove(this.stateClasses.isHidden);

    document.addEventListener('keydown', this.onEscapePress);
  };

  /**
   * Закрывает мобильное меню
   */
  closeMenu = () => {
    this.isMenuOpen = false;
    this.burgerButtonElement?.classList.remove(this.stateClasses.isActive);
    this.menuElement?.classList.remove(this.stateClasses.isActive);
    this.burgerButtonElement?.setAttribute('aria-expanded', 'false');
    bodyUnlock();

    document.removeEventListener('keydown', this.onEscapePress);
  };

  onMenuLinkClick = (event) => {
    if (event.target.closest('a')) {
      this.closeMenu();
    }
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

  bindEvents() {
    this.burgerButtonElement?.addEventListener('click', this.toggleMenu);
    this.menuElement?.addEventListener('click', this.onMenuLinkClick);
    this.overlayElement?.addEventListener('click', this.onOverlayClick);
    window.addEventListener('scroll', this.handleScroll, { passive: true });
  }

  /**
   * Очищает все обработчики событий и observers
   * Вызывается при уничтожении компонента
   */
  destroy() {
    this.burgerButtonElement?.removeEventListener('click', this.toggleMenu);
    this.menuElement?.removeEventListener('click', this.onMenuLinkClick);
    this.overlayElement?.removeEventListener('click', this.onOverlayClick);
    window.removeEventListener('scroll', this.handleScroll);
    document.removeEventListener('keydown', this.onEscapePress);
    this.resizeObserver?.disconnect();
  }
}

export default Header;
