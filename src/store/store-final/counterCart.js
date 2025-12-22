const counterCart = () => {
  const cart = document.querySelector('.js-cart'); //делегирование событий, вешаем обработчик на всю корзину

  const updateCartItemCount = () => {
    cart.addEventListener('click', (e) => {
      let currentItems, minusBtn;

      if (e.target.matches('.js-minus') || e.target.matches('.js-plus')) {
        const counter = e.target.closest('.js-counter'); //ближайший родитель для элемента, по которому был клик
        currentItems = counter.querySelector('.js-current-items'); //текущее значение счетчика, ищем именно внутри родителя, а не всего документа
        minusBtn = counter.querySelector('.js-minus');
      }

      if (e.target.matches('.js-plus')) {
        currentItems.textContent = ++currentItems.textContent;
        minusBtn.classList.remove('disabled');
      }

      if (e.target.matches('.js-minus')) {
        if (parseInt(currentItems.textContent) > 1) {
          currentItems.textContent = --currentItems.textContent;
        } else if (parseInt(currentItems.textContent) === 1) {
          //если 0, делаем кнопку не активной
          currentItems.textContent = --currentItems.textContent;
          minusBtn.classList.add('disabled');
        }
      }
    });
  };
  updateCartItemCount();
};

export { counterCart };

/* 
<div class="counter row jcc aic js-counter">
  <button type="button" class="minus control row jcc aic js-minus disabled">-</button>
  <div class="current-items row jcc aic js-current-items">1</div>
  <button type="button" class="plus control row jcc aic js-plus">+</button>
</div>
*/
