import createProductCard from './createProductCart';

const paginate = (products) => {
  let productCount = 10; // количество продуктов на странице
  let currentPage = 1;

  const productContainer = document.querySelector('[data-products-catalog]');
  const pagination = document.querySelector('.js-pagination');
  const btnPrevPagination = document.querySelector('.js-pagination-btn-prev');
  const btnNextPagination = document.querySelector('.js-pagination-btn-next');

  const renderProducts = (products, container, numberOfProducts, page) => {
    container.innerHTML = '';

    const firstProductIndex = numberOfProducts * page - numberOfProducts;
    const lastProductIndex = firstProductIndex + numberOfProducts;
    const productsOnPage = products.slice(firstProductIndex, lastProductIndex);

    productsOnPage.forEach((product) => {
      const li = createProductCard(product);
      container.append(li);
    });
  };

  const renderBtn = (page) => {
    const li = document.createElement('li');
    li.classList.add('pagination-item');
    li.textContent = page;

    if (currentPage === page) {
      li.classList.add('active');
    }

    return li;
  };

  const renderPagination = (products, numberOfProducts) => {
    const pagesCount = Math.ceil(products.length / numberOfProducts);
    const ul = document.querySelector('.js-pagination-list');

    ul.innerHTML = ''; // очищаем старые кнопки

    for (let i = 1; i <= pagesCount; i++) {
      const li = renderBtn(i);
      ul.append(li);
    }

    pagination.classList.remove('hidden');
  };

  const updatePagination = () => {
    pagination.addEventListener('click', (event) => {
      if (!event.target.closest('.pagination-item')) {
        return;
      }

      currentPage = +event.target.textContent;
      renderProducts(products, productContainer, productCount, currentPage);

      const currentLi = document.querySelector('.pagination-item.active');
      currentLi?.classList.remove('active');
      event.target.classList.add('active');
    });
  };

  const handlePagination = (event) => {
    const currentActiveLi = document.querySelector('.pagination-item.active');
    let newActiveLi;

    const liElements = document.querySelectorAll('.pagination-item');

    if (event.target.closest('.js-pagination-btn-next')) {
      newActiveLi = currentActiveLi.nextElementSibling;
      currentPage++;
    } else {
      newActiveLi = currentActiveLi.previousElementSibling;
      currentPage--;
    }

    if (!newActiveLi && event.target.closest('.js-pagination-btn-next')) {
      newActiveLi = liElements[0];
    } else if (!newActiveLi) {
      newActiveLi = liElements[liElements.length - 1];
    }

    currentActiveLi.classList.remove('active');
    newActiveLi.classList.add('active');

    if (currentPage > liElements.length) {
      currentPage = 1;
    } else if (currentPage < 1) {
      currentPage = liElements.length;
    }

    renderProducts(products, productContainer, productCount, currentPage);
  };

  // Инициализация
  renderProducts(products, productContainer, productCount, currentPage);
  renderPagination(products, productCount);
  updatePagination();

  btnNextPagination.addEventListener('click', handlePagination);
  btnPrevPagination.addEventListener('click', handlePagination);
};

export { paginate };
