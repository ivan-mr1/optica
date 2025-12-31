export default class FavoriteView {
  defaultSelectors = {
    list: '[data-favorite-list]',
    totalPrice: '.favorite__fullprice',
    productId: 'data-product-id',
    btnRemove: 'data-favorite-remove-btn',
    btnBuy: 'data-favorite-buy-btn',
  };

  defaultClasses = {
    item: 'favorite__item',
    product: 'favorite-product',
    emptyMessage: 'favorite__empty',
  };

  defaultI18n = {
    emptyList: 'Ваш список порожній',
    currency: 'грн',
    art: 'Art:',
    titleRemove: 'Видалити',
    titleBuy: 'В кошик',
    ariaRemove: 'Видалити товар зі списку обраного',
    ariaBuy: 'Додати товар у кошик',
    ariaProductLink: 'Перейти к товару',
    iconTrash: `<svg class="svg svg--20" aria-hidden="true"><use xlink:href="#icon-monochrome-trash"></use></svg>`,
    iconCart: `<svg class="svg svg--20" aria-hidden="true"><use xlink:href="#icon-monochrome-cart"></use></svg>`,
  };

  constructor(options = {}, formatter = null) {
    this.selectors = { ...this.defaultSelectors, ...options.selectors };
    this.classes = { ...this.defaultClasses, ...options.classes };
    this.i18n = { ...this.defaultI18n, ...options.i18n };

    this.formatter = formatter || new Intl.NumberFormat('uk-UA');
    this.container = document.querySelector(this.selectors.list);
    this.totalPriceElement = document.querySelector(this.selectors.totalPrice);
  }

  render(products, total) {
    if (!this.container) {
      return;
    }

    if (products.length === 0) {
      this.container.innerHTML = `<li class="${this.classes.emptyMessage}">${this.i18n.emptyList}</li>`;
    } else {
      this.container.innerHTML = products
        .map((product) => this.getItemTemplate(product))
        .join('');
    }

    this.updateTotal(total);
  }

  updateTotal(total) {
    if (this.totalPriceElement) {
      this.totalPriceElement.textContent = `${this.formatter.format(total)} ${this.i18n.currency}`;
    }
  }

  getItemTemplate(product) {
    const { id, image, model, price, article } = product;
    const s = this.selectors;
    const c = this.classes;
    const t = this.i18n;

    return `
      <li class="${c.item}">
        <article class="${c.product}" ${s.productId}="${id}">
          <a href="/card.html?id=${id}" 
             target="_blank" 
             class="${c.product}__image" 
             aria-label="${t.ariaProductLink} ${model}">
            <img src="${image}" alt="" width="80" height="80" loading="lazy" aria-hidden="true" />
          </a>
          <div class="${c.product}__wrapper">
            <a href="/card.html?id=${id}" 
               target="_blank" 
               class="${c.product}__title"
               aria-label="${model}">${model}</a>
            <div class="${c.product}__inner">
              <div class="${c.product}__article" aria-label="Артикул">${t.art} ${article}</div>
              <div class="${c.product}__price" aria-label="Ціна">${this.formatter.format(price)} ${t.currency}</div>
            </div>
          </div>
          <div class="${c.product}__buttons">
            <button type="button" 
                    ${s.btnRemove} 
                    class="${c.product}__btn" 
                    title="${t.titleRemove}" 
                    aria-label="${t.ariaRemove}: ${model}">
              ${t.iconTrash}
            </button>
            <button type="button" 
                    ${s.btnBuy} 
                    class="${c.product}__btn" 
                    title="${t.titleBuy}" 
                    aria-label="${t.ariaBuy}: ${model}">
              ${t.iconCart}
            </button>
          </div>
        </article>
      </li>`;
  }
}
