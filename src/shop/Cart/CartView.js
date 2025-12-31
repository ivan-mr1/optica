export default class CartView {
  defaultSelectors = {
    list: '[data-cart-list]',
    totalPrice: '[data-cart-total-price]',
    productId: 'data-product-id',
    btnMinus: 'data-cart-minus',
    btnPlus: 'data-cart-plus',
    btnRemove: 'data-cart-remove-btn',
  };

  defaultClasses = {
    item: 'cart-item',
    itemInfo: 'cart-item__info',
    itemName: 'cart-item__name',
    itemCategory: 'cart-item__category',
    itemActions: 'cart-item__actions',
    quantity: 'quantity',
    quantityBtn: 'quantity__button',
    priceBlock: 'cart-item__price-block',
    price: 'cart-item__price',
    deleteBtn: 'cart-item__delete',
    emptyMessage: 'cart__empty',
  };

  defaultI18n = {
    emptyCart: 'Ваш кошик порожній',
    currency: 'грн',
    defaultCategory: 'Окуляри',
    deleteLabel: 'Видалити товар',
    minusLabel: 'Зменшити кількість',
    plusLabel: 'Збільшити кількість',
    iconTrash: `
      <svg class="svg svg--20">
        <use xlink:href="#icon-monochrome-trash"></use>
      </svg>
    `,
  };

  constructor(options = {}, settings = {}, formatter = null) {
    this.selectors = { ...this.defaultSelectors, ...options.selectors };
    this.classes = { ...this.defaultClasses, ...options.classes };
    this.i18n = { ...this.defaultI18n, ...options.i18n };

    this.settings = settings;
    this.formatter = formatter || new Intl.NumberFormat('uk-UA');

    this.container = document.querySelector(this.selectors.list);
    this.totalPriceElements = document.querySelectorAll(
      this.selectors.totalPrice,
    );
  }

  render(products, total) {
    if (!this.container) {
      return;
    }

    if (products.length === 0) {
      this.container.innerHTML = `
        <li class="${this.classes.emptyMessage}">${this.i18n.emptyCart}</li>
      `;
    } else {
      this.container.innerHTML = products
        .map((product) => this.getItemTemplate(product))
        .join('');
    }

    this.updateTotalDisplay(total);
  }

  updateTotalDisplay(total) {
    const formatted = this.formatter.format(total);
    this.totalPriceElements.forEach((el) => {
      el.textContent = `${formatted} ${this.i18n.currency}`;
    });
  }

  getItemTemplate(product) {
    const { id, image, model, price, category, count } = product;

    const isMin = count <= (this.settings.minQuantity || 1);
    const isMax = count >= (this.settings.maxQuantity || 99);

    const s = this.selectors;
    const c = this.classes;
    const t = this.i18n;

    return `
      <li class="${c.item}" ${s.productId}="${id}">
        <a href="/card.html?id=${id}" class="${c.item}-image">
          <img src="${image}" alt="${model}" loading="lazy" />
        </a>
        <div class="${c.itemInfo}">
          <h3 class="${c.itemName}">${model}</h3>
          <p class="${c.itemCategory}">${category || t.defaultCategory}</p>
        </div>
        <div class="${c.itemActions}">
          <div class="${c.quantity}">
            <button type="button" 
                    ${s.btnMinus} 
                    class="${c.quantityBtn}" 
                    ${isMin ? 'disabled' : ''} 
                    aria-label="${t.minusLabel}" 
                    title="${t.minusLabel}">−</button>
            <input type="number" class="${c.quantity}__input" value="${count}" readonly />
            <button type="button" 
                    ${s.btnPlus} 
                    class="${c.quantityBtn}" 
                    ${isMax ? 'disabled' : ''} 
                    aria-label="${t.plusLabel}" 
                    title="${t.plusLabel}">+</button>
          </div>
          <div class="${c.priceBlock}">
            <span class="${c.price}">${this.formatter.format(price * count)} ${t.currency}</span>
          </div>
          <button type="button" 
                  ${s.btnRemove} 
                  class="${c.deleteBtn}" 
                  aria-label="${t.deleteLabel}" 
                  title="${t.deleteLabel}">
              ${t.iconTrash}
          </button>
        </div>
      </li>`;
  }
}
