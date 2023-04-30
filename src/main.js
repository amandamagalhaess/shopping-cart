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
const emptyCart = document.querySelector('.empty-cart');
const celulares = document.getElementById('celulares');
const beleza = document.getElementById('beleza');
const televisores = document.getElementById('televisores');
const moda = document.getElementById('moda');
const veiculos = document.getElementById('veiculos');
const mercado = document.getElementById('mercado');
const cartBtn = document.getElementById('cart-icon');
const main = document.querySelector('main');
const categories = document.querySelector('.categories');
const cart = document.querySelector('aside');
const arrow = document.getElementById('arrow');
const logo = document.querySelector('.logo');
const logoSm = document.querySelector('.logo-sm');

logo.addEventListener('click', () => location.reload());
logoSm.addEventListener('click', () => location.reload());

cartBtn.addEventListener('click', () => {
    if (cart.classList.contains('hide')) {
      cart.classList.remove('hide');
      arrow.classList.remove('hide');
      categories.classList.remove('categories-width');
      // cart.style.display = 'none';
      // arrow.style.display = 'block';
      // main.style.width = '100%';
      // categories.style.width = '90%';
    } else {
      cart.classList.add('hide');
      arrow.classList.add('hide');
      categories.classList.add('categories-width');
      // cart.style.display = 'block';
      // arrow.style.display = 'none';
      // main.style.width = '75%';
      // categories.style.width = '100%';
    }
  }
);

const defineProducts = async () => {
  products.innerHTML = '';
  let product;
  if (searchInput.value === '') {
    product = 'computadores';
  } else {
    product = searchInput.value;
  }

  addLoading();
  fetchProductsList(product).then(() => removeLoading());
  addCartProducts(product);
}
searchBtn.addEventListener('click', defineProducts);

const productForCategory = (category) => {
  products.innerHTML = '';

  addLoading();
  fetchProductsList(category).then(() => removeLoading());
  addCartProducts(category);
}
celulares.addEventListener('click', () => productForCategory('celulares'));
beleza.addEventListener('click', () => productForCategory('maquiagem'));
televisores.addEventListener('click', () => productForCategory('televisores'));
moda.addEventListener('click', () => productForCategory('roupa adulta'));
veiculos.addEventListener('click', () => productForCategory('veiculos'));
mercado.addEventListener('click', () => productForCategory('mercado'));

const addLoading = () => {
  const loadingEl = document.createElement('p');
  loadingEl.innerHTML = 'carregando...';
  loadingEl.className = 'loading';
  messages.appendChild(loadingEl);
};
addLoading();

const removeLoading = () => {
  document.getElementsByClassName('loading')[0].remove();
};
fetchProductsList('computadores').then(() => removeLoading());

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
    await showProducts('computadores');
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

const clearCart = () => {
  ol.innerHTML = '';
  totalPriceEl.innerHTML = 0.00;
  counter.innerHTML = 0;

  localStorage.setItem('cartProducts', JSON.stringify([]));
  localStorage.setItem('counter', JSON.stringify(counter.innerHTML));
  localStorage.setItem('totalPrice', JSON.stringify(totalPriceEl.innerHTML));
}

emptyCart.addEventListener('click', clearCart)

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
