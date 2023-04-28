import { searchCep } from './helpers/cepFunctions.js';
import { fetchProduct, fetchProductsList } from './helpers/fetchFunctions.js';
import { createCartProductElement, createProductElement } from './helpers/shopFunctions.js';
import { getSavedCartIDs, saveCartID } from './helpers/cartFunctions.js';

const products = document.getElementsByClassName('products')[0];
const messages = document.getElementById('messages');
const ol = document.getElementsByClassName('cart__products')[0];
const totalPriceEl = document.getElementsByClassName('total-price')[0];
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const counter = document.getElementById('counter');

searchBtn.addEventListener('click', async () => {
  products.innerHTML = '';
  let product;
  if (searchInput.value === '') {
    product = 'eletrônicos';
  } else {
    product = searchInput.value;
  }

  addLoading();
  fetchProductsList(product).then(() => removeLoading());
  addCartProducts(product);
});

const addLoading = () => {
  const loadingEl = document.createElement('h2');
  loadingEl.innerHTML = 'carregando...';
  loadingEl.className = 'loading';
  messages.appendChild(loadingEl);
};
addLoading();

const removeLoading = () => {
  document.getElementsByClassName('loading')[0].remove();
};
fetchProductsList('eletrônicos').then(() => removeLoading());

const showError = () => {
  const errorEl = document.createElement('h2');
  errorEl.innerHTML = 'Algum erro ocorreu, recarregue a página e tente novamente';
  errorEl.className = 'error';
  messages.appendChild(errorEl);
};

const showProducts = async (product) => {
  const data = await fetchProductsList(product);
  if (data !== undefined) {
    const productsSection = data.map((item) => createProductElement(item));
    productsSection.forEach((product) => products.appendChild(product));
  } else {
    showError();
  }
};

const addCartProducts = async (product) => {
  if (product === undefined) {
    await showProducts('eletrônicos');
  } else {
    await showProducts(product);
  }

  const buttons = document.getElementsByClassName('product__add');

  for (let index = 0; index < buttons.length; index += 1) {
    const button = buttons[index];
    button.addEventListener('click', async () => {
      const id = button.parentNode.firstChild.innerHTML;
      saveCartID(id);
      const productData = await fetchProduct(id);
      const li = createCartProductElement(productData);
      ol.appendChild(li);
      let totalPrice = parseFloat(totalPriceEl.innerHTML);
      totalPrice += productData.price;
      totalPriceEl.innerHTML = totalPrice.toFixed(2);

      let count = Number(counter.innerHTML);
      count += 1;
      counter.innerHTML = count;

      localStorage.setItem('counter', JSON.stringify(counter.innerHTML));
      localStorage.setItem('totalPrice', JSON.stringify(totalPriceEl.innerHTML));
    });
  }
};
addCartProducts();

if (localStorage.getItem('counter')) {
  counter.innerHTML = JSON.parse(localStorage.getItem('counter'));
} else {
  totalPriceEl.innerHTML = 0;
}

if (localStorage.getItem('totalPrice')) {
  totalPriceEl.innerHTML = JSON.parse(localStorage.getItem('totalPrice'));
} else {
  const price = 0;
  totalPriceEl.innerHTML = price.toFixed(2);
}

const ids = getSavedCartIDs();
const productsData = ids.map((id) => fetchProduct(id));
Promise.all(productsData).then((values) => {
  values.forEach((value) => {
    const li = createCartProductElement(value);
    ol.appendChild(li);
  });
});

document.querySelector('.cep-button').addEventListener('click', searchCep);
