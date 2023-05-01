import { searchCep } from './helpers/cepFunctions.js';
import { fetchProduct, fetchProductsList } from './helpers/fetchFunctions.js';
import { createCartProductElement, createProductElement } from './helpers/shopFunctions.js';
import { getSavedCartIDs, saveCartID, saveQuantity } from './helpers/cartFunctions.js';

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
  } else {
    cart.classList.add('hide');
    arrow.classList.add('hide');
    categories.classList.add('categories-width');
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
  addProducts(product);
}
searchBtn.addEventListener('click', defineProducts);

const productForCategory = (category) => {
  products.innerHTML = '';

  addLoading();
  fetchProductsList(category).then(() => removeLoading());
  addProducts(category);
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

const toastLiveExample = document.getElementById('liveToast');
const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);

const addCartProducts = async (button) => {
  toastBootstrap.show();

  setTimeout(() => {
    toastLiveExample.classList.add('showing');
    setTimeout(() => {
      toastLiveExample.classList.remove('showing');
      toastLiveExample.classList.remove('show');
      toastLiveExample.classList.add('hide');
    }, 200);
  }, 2000);

  const lis = document.getElementsByClassName('cart__product');
  const lisArr = [...lis];

  const productName = button.parentNode.lastChild.previousSibling.innerHTML;
  const productCart = lisArr.find((li) => li.firstChild.nextSibling.firstChild.innerHTML === productName);

  const id = button.parentNode.firstChild.innerHTML;
  const productData = await fetchProduct(id);

  if (productCart === undefined) {
    saveCartID(id);
    const li = createCartProductElement(productData);
    ol.appendChild(li);
  } else {
    let productQty = productCart.firstChild.nextSibling.lastChild.firstChild.nextSibling;
    saveQuantity(productQty.innerHTML, id);

    productQty.innerHTML = Number(productQty.innerHTML) + 1;
  }

  let totalPrice = parseFloat(totalPriceEl.innerHTML);
  totalPrice += productData.price;
  totalPriceEl.innerHTML = totalPrice.toFixed(2);

  let count = Number(counter.innerHTML);
  count += 1;
  counter.innerHTML = count;

  localStorage.setItem('counter', JSON.stringify(counter.innerHTML));
  localStorage.setItem('totalPrice', JSON.stringify(totalPriceEl.innerHTML));
};

const addProducts = async (product) => {
  if (product === undefined) {
    await showProducts('computadores');
  } else {
    await showProducts(product);
  }

  const buttons = document.getElementsByClassName('product__add');

  for (let index = 0; index < buttons.length; index += 1) {
    const button = buttons[index];
    button.addEventListener('click', () => addCartProducts(button));
  }
};
addProducts();

const clearCart = () => {
  ol.innerHTML = '';
  totalPriceEl.innerHTML = 0.00;
  counter.innerHTML = 0;

  localStorage.setItem('quantity', JSON.stringify([]));
  localStorage.setItem('cartProducts', JSON.stringify([]));
  localStorage.setItem('counter', JSON.stringify(counter.innerHTML));
  localStorage.setItem('totalPrice', JSON.stringify(totalPriceEl.innerHTML));
}
emptyCart.addEventListener('click', clearCart);

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

    const quantity = [...document.getElementsByClassName('product-qty')];
    quantity.forEach((q, index) => {
      q.innerHTML = JSON.parse(localStorage.getItem('quantity'))[index];
    })
  });
});

document.querySelector('.cep-button').addEventListener('click', searchCep);
