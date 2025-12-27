const counter = (counterSelector, listSelector) => {
  const counter = document.querySelector(counterSelector);
  const list = document.querySelector(listSelector);

  if (!counter || !list) {
    return;
  }

  const count = list.children.length;

  counter.textContent = count;
  counter.classList.toggle('is-hidden', count === 0);
};

export default counter;
