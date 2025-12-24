class CartCounter {
  selectors = {
    cart: '.js-cart',
    counter: '.js-counter',
    minus: '.js-minus',
    plus: '.js-plus',
    value: '.js-current-items',
  };

  stateClasses = {
    disabled: 'disabled',
  };

  MIN_VALUE = 1;

  constructor() {
    this.cart = document.querySelector(this.selectors.cart);

    if (!this.cart) {
      return;
    }

    this.bindEvents();
  }

  bindEvents() {
    this.cart.addEventListener('click', this.handleClick);
  }

  handleClick = (event) => {
    const isPlus = event.target.closest(this.selectors.plus);
    const isMinus = event.target.closest(this.selectors.minus);

    if (!isPlus && !isMinus) {
      return;
    }

    const counter = event.target.closest(this.selectors.counter);
    if (!counter) {
      return;
    }

    const valueEl = counter.querySelector(this.selectors.value);
    const minusBtn = counter.querySelector(this.selectors.minus);

    let value = Number(valueEl.textContent);

    if (isPlus) {
      value++;
    }

    if (isMinus && value > this.MIN_VALUE) {
      value--;
    }

    valueEl.textContent = value;
    this.updateMinusState(minusBtn, value);
  };

  updateMinusState(button, value) {
    const isDisabled = value <= this.MIN_VALUE;

    button.disabled = isDisabled;
    button.classList.toggle(this.stateClasses.disabled, isDisabled);
  }
}

export default CartCounter;

/* 
<div class="counter row jcc aic js-counter">
  <button
    type="button"
    class="minus control row jcc aic js-minus disabled"
    disabled
    aria-label="Decrease quantity"
  >
    −
  </button>

  <div
    class="current-items row jcc aic js-current-items"
    aria-live="polite"
  >
    1
  </div>

  <button
    type="button"
    class="plus control row jcc aic js-plus"
    aria-label="Increase quantity"
  >
    +
  </button>
</div>
*/
