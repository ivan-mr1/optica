export default class Cart {
  selectors = {
    cart: '.js-cart',
    productsList: '[data-products-catalog]',
    cartList: '.js-cart-list',
    cartOrder: '.js-cart-order-container',
    cartEmpty: '.js-cart-empty-container',
    totalPrice: '.js-cart-total-price',

    buyButton: '.js-buy-button',
    removeButton: '.js-remove',
    plusButton: '.js-plus',
    minusButton: '.js-minus',

    cartItem: '.js-cart-item',
    counter: '.js-counter',
    currentItems: '.js-current-items',
    cartPrice: '.js-cart-price',
  };

  stateClasses = {
    hidden: 'hidden',
    disabled: 'disabled',
  };

  constructor() {
    this.cart = document.querySelector(this.selectors.cart);
    this.productsList = document.querySelector(this.selectors.productsList);
    this.cartList = document.querySelector(this.selectors.cartList);
    this.cartOrder = document.querySelector(this.selectors.cartOrder);
    this.cartEmpty = document.querySelector(this.selectors.cartEmpty);
    this.totalPrice = document.querySelector(this.selectors.totalPrice);

    this.formatter = new Intl.NumberFormat('ru');

    this.sounds = {
      add: new Audio('assets/audio/add1.mp3'),
      stepper: new Audio('assets/audio/counter1.mp3'),
      remove: new Audio('assets/audio/trash1.mp3'),
    };

    this.bindEvents();
    this.toggleCartStatus();
    this.calcTotalCartValue();
  }

  /* ================= EVENTS ================= */

  bindEvents() {
    this.productsList.addEventListener('click', this.onAddProduct);
    this.cartList.addEventListener('click', this.onCartClick);
  }

  onAddProduct = (e) => {
    if (!e.target.classList.contains(this.selectors.buyButton.slice(1))) {
      return;
    }

    const product = e.target.closest('.js-product');
    const productInfo = this.getProductInfo(product);

    const productInCart = this.cartList.querySelector(`#${productInfo.id}`);

    if (productInCart) {
      this.incrementProduct(productInCart);
    } else {
      this.renderProduct(productInfo);
    }

    this.toggleCartStatus();
    this.calcTotalCartValue();
    this.playSound(this.sounds.add);
  };

  onCartClick = (e) => {
    if (e.target.classList.contains(this.selectors.removeButton.slice(1))) {
      this.removeProduct(e);
      return;
    }

    if (
      e.target.classList.contains(this.selectors.plusButton.slice(1)) ||
      e.target.classList.contains(this.selectors.minusButton.slice(1))
    ) {
      this.changeCounter(e);
    }
  };

  /* ================= LOGIC ================= */

  getProductInfo(product) {
    return {
      id: product.querySelector('.js-link-card').id,
      model: product.querySelector('.js-title-card').textContent,
      price: product
        .querySelector('.js-price-card')
        .textContent.replace(/\s/g, ''),
      image: product.querySelector('.js-image-card')?.src,
    };
  }

  incrementProduct(productInCart) {
    const count = productInCart.querySelector(this.selectors.currentItems);
    const minusBtn = productInCart.querySelector(this.selectors.minusButton);

    count.textContent = parseInt(count.textContent) + 1;
    minusBtn.classList.remove(this.stateClasses.disabled);
  }

  changeCounter(e) {
    const counter = e.target.closest(this.selectors.counter);
    const count = counter.querySelector(this.selectors.currentItems);
    const minusBtn = counter.querySelector(this.selectors.minusButton);

    let value = parseInt(count.textContent);

    if (e.target.classList.contains(this.selectors.plusButton.slice(1))) {
      value++;
      minusBtn.classList.remove(this.stateClasses.disabled);
    }

    if (e.target.classList.contains(this.selectors.minusButton.slice(1))) {
      value--;
      if (value <= 1) {
        value = 1;
        minusBtn.classList.add(this.stateClasses.disabled);
      }
    }

    count.textContent = value;
    this.calcTotalCartValue();
    this.playSound(this.sounds.stepper);
  }

  removeProduct(e) {
    e.target.closest(this.selectors.cartItem).remove();
    this.toggleCartStatus();
    this.calcTotalCartValue();
    this.playSound(this.sounds.remove);
  }

  /* ================= RENDER ================= */

  renderProduct(product) {
    const li = document.createElement('li');
    li.classList.add('cart__item', 'item-cart', 'js-cart-item');

    li.innerHTML = `
      <span class="close js-remove"></span>
      <div class="item-cart__wrapper" id="${product.id}">
        <div class="item-cart__model">${product.model}</div>
        <div class="item-cart__image">
          <img src="${product.image}" alt="${product.model}">
        </div>

        <div class="item-cart__counter">
          <div class="stapper js-counter">
            <button type="button"
              class="stapper__button js-minus ${this.stateClasses.disabled}">
              –
            </button>
            <div class="stapper__number js-current-items">1</div>
            <button type="button" class="stapper__button js-plus">+</button>
          </div>

          <div class="item-cart__price">
            <span
              class="item-cart__price-counter js-cart-price"
              data-price="${product.price}">
              ${product.price}
            </span>
            <span class="item-cart__currency">$</span>
          </div>
        </div>
      </div>
    `;

    this.cartList.append(li);
  }

  /* ================= UI ================= */

  toggleCartStatus() {
    const hasItems = this.cart.querySelector(this.selectors.cartItem);

    this.cartOrder.classList.toggle(this.stateClasses.hidden, !hasItems);
    this.cartEmpty.classList.toggle(this.stateClasses.hidden, hasItems);
  }

  calcTotalCartValue() {
    let total = 0;

    this.cartList.querySelectorAll(this.selectors.cartItem).forEach((item) => {
      const count = item.querySelector(this.selectors.currentItems);
      const price = item.querySelector(this.selectors.cartPrice);

      const value = parseInt(count.textContent) * parseInt(price.dataset.price);

      price.textContent = this.formatter.format(value);
      total += value;
    });

    this.totalPrice.textContent = this.formatter.format(total);
  }

  playSound(sound) {
    sound.currentTime = 0;
    sound.play().catch(() => {});
  }
}
