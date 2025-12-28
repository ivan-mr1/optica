// Количество показываемых карточек при первом рендере
// export const COUNT_SHOW_CARDS_CLICK = 5;

export const ERROR_SERVER = 'Помилка сервера, спробуйте пізніше!';
export const NO_PRODUCTS_IN_THIS_CATEGORY = 'Товарів у цій категорії немає!';
export const PRODUCT_INFORMATION_NOT_FOUND =
  'Інформація про товар не знайдена!';
export const NO_ITEMS_CART = 'У кошику немає товарів!';

// Вывод ошибки
export function showErrorMessage(message) {
  const h1 = document.querySelector('.inner .h1');
  const msg = `<div class="error">
            <p>${message}</p>
            <p><a href="/">Перейти до переліку товарів!</a></p>
        </div>`;
  h1.insertAdjacentHTML('afterend', msg);
}
