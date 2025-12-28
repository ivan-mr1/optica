import { selectors, stateClasses } from './cartDom.js';

export const handleCounterClick = (e, onChange) => {
  if (
    !e.target.classList.contains(selectors.plusButton.slice(1)) &&
    !e.target.classList.contains(selectors.minusButton.slice(1))
  ) {
    return;
  }

  const counter = e.target.closest(selectors.counter);
  const count = counter.querySelector(selectors.currentItems);
  const minusBtn = counter.querySelector(selectors.minusButton);

  let value = parseInt(count.textContent);

  if (e.target.classList.contains(selectors.plusButton.slice(1))) {
    value++;
    minusBtn.classList.remove(stateClasses.disabled);
  }

  if (e.target.classList.contains(selectors.minusButton.slice(1))) {
    value--;
    if (value <= 1) {
      value = 1;
      minusBtn.classList.add(stateClasses.disabled);
    }
  }

  count.textContent = value;
  onChange();
};
