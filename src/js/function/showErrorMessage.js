// Вывод ошибки
export function showErrorMessage(message) {
  const h1 = document.querySelector('.wrapper h1');
  const msg = `<div class="error">
            <p>${message}</p>
            <p><a href="/">Перейти к списку товаров!</a></p>
        </div>`;
  h1.insertAdjacentHTML('afterend', msg);
}
