const cartData = () => {
  const cart = document.querySelector('.js-cart');
  const productsList = document.querySelector('[data-products-catalog]');
  const cartList = document.querySelector('.js-cart-list');
  const cartOrder = document.querySelector('.js-cart-order-container');
  const cartEmpty = document.querySelector('.js-cart-empty-container');
  const formatter = new Intl.NumberFormat('ru');

  // === Аудио ===
  const soundAdd = new Audio('assets/audio/add1.mp3'); // звук при добавлении
  const soundStepper = new Audio('assets/audio/counter1.mp3'); // звук при изменении количества
  const soundRemove = new Audio('assets/audio/trash1.mp3'); // звук при удалении

  // чтобы звук играл мгновенно, сбрасываем время
  const playSound = (sound) => {
    sound.currentTime = 0;
    sound.play().catch(() => {}); // игнорим ошибку, если autoplay заблокирован
  };

  const updateCartItemCount = () => {
    cart.addEventListener('click', (e) => {
      if (!e.target.matches('.js-minus') && !e.target.matches('.js-plus')) {
        return;
      }

      const counter = e.target.closest('.js-counter');
      const currentItems = counter.querySelector('.js-current-items');
      const minusBtn = counter.querySelector('.js-minus');

      if (e.target.matches('.js-plus')) {
        currentItems.textContent = ++currentItems.textContent;
        minusBtn.classList.remove('disabled');
        calcTotalCartValue();
        playSound(soundStepper); // звук stepper
      }

      if (e.target.matches('.js-minus')) {
        if (parseInt(currentItems.textContent) > 2) {
          currentItems.textContent = --currentItems.textContent;
        } else if (parseInt(currentItems.textContent) === 2) {
          currentItems.textContent = --currentItems.textContent;
          minusBtn.classList.add('disabled');
        }
        calcTotalCartValue();
        playSound(soundStepper); // звук stepper
      }
    });
  };
  updateCartItemCount();

  const addProductToCart = () => {
    productsList.addEventListener('click', (e) => {
      if (!e.target.classList.contains('js-buy-button')) {
        return;
      }

      const product = e.target.closest('.js-product');
      const imageCart = product.querySelector('.js-image-card');
      const modelCart = product.querySelector('.js-title-card');
      const priceCart = product.querySelector('.js-price-card');
      const linkCart = product.querySelector('.js-link-card');

      const productInfo = {
        id: linkCart.getAttribute('id'),
        model: modelCart.textContent,
        price: priceCart.textContent,
        photo: imageCart.src,
      };

      const productInCart = cartList.querySelector(`#${productInfo.id}`);
      if (productInCart) {
        const currentItemsProducts =
          productInCart.querySelector('.js-current-items');
        const minusBtn = productInCart.querySelector('.js-minus');

        currentItemsProducts.textContent =
          parseInt(currentItemsProducts.textContent) + 1;
        minusBtn.classList.remove('disabled');
      } else {
        renderProductCart(productInfo);
      }

      toggleCartStatus();
      calcTotalCartValue();
      playSound(soundAdd); // звук добавления
    });
  };
  addProductToCart();

  const renderProductCart = (productInfo) => {
    const li = document.createElement('li');
    li.classList.add('cart__item', 'item-cart', 'js-cart-item');
    li.innerHTML = `
      <span class="close js-remove"></span>
      <div class="item-cart__wrapper" id="${productInfo.id}">
        <div class="item-cart__model">${productInfo.model}</div>
        <div class="item-cart__image">
          <img src="${productInfo.photo}" alt="product" class="item-cart__img">
        </div>
        <div class="item-cart__counter">
          <div class="stapper js-counter">
            <button type="button" class="stapper__button js-minus disabled">–</button>
            <div class="stapper__number js-current-items">1</div>
            <button type="button" class="stapper__button js-plus">+</button>
          </div>
          <div class="item-cart__price">
            <span class="item-cart__price-counter js-cart-price"
              data-price="${productInfo.price}">${productInfo.price}</span>
            <span class="item-cart__currency">$</span>
          </div>
        </div>
      </div>
    `;

    cartList.append(li);
  };

  const removeProductFromCart = () => {
    cartList.addEventListener('click', (e) => {
      if (!e.target.classList.contains('js-remove')) {
        return;
      }

      const cartItem = e.target.closest('.js-cart-item');
      cartItem.remove();
      toggleCartStatus();
      calcTotalCartValue();
      playSound(soundRemove); // звук удаления
    });
  };
  removeProductFromCart();

  const toggleCartStatus = () => {
    if (cart.querySelector('.js-cart-item')) {
      cartOrder.classList.remove('hidden');
      cartEmpty.classList.add('hidden');
    } else {
      cartOrder.classList.add('hidden');
      cartEmpty.classList.remove('hidden');
    }
  };
  toggleCartStatus();

  const calcTotalCartValue = () => {
    const cartItems = document.querySelectorAll('.js-cart-item');
    const cartTotalPrice = document.querySelector('.js-cart-total-price');

    let totalCartValue = 0;

    cartItems.forEach((item) => {
      const itemCount = item.querySelector('.js-current-items');
      const itemPrice = item.querySelector('.js-cart-price');
      const itemTotalPrice =
        parseInt(itemCount.textContent) *
        parseInt(itemPrice.dataset.price.replace(/\s/g, ''));

      itemPrice.textContent = formatter.format(itemTotalPrice);
      totalCartValue += itemTotalPrice;
    });

    cartTotalPrice.textContent = formatter.format(totalCartValue);
  };
  calcTotalCartValue();
};

export { cartData };
