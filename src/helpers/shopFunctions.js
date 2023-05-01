import { removeCartID, removeQty, saveQuantity } from './cartFunctions.js';
import { fetchProduct } from './fetchFunctions.js';

// Esses comentários que estão antes de cada uma das funções são chamados de JSdoc,
// experimente passar o mouse sobre o nome das funções e verá que elas possuem descrições!

// Fique a vontade para modificar o código já escrito e criar suas próprias funções!

/**
 * Função responsável por criar e retornar o elemento de imagem do produto.
 * @param {string} imageSource - URL da imagem.
 * @returns {Element} Elemento de imagem do produto.
 */
const createProductImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'product__image';
  img.src = imageSource.replace('I.jpg', 'O.jpg');
  return img;
};

/**
 * Função responsável por criar e retornar qualquer elemento.
 * @param {string} element - Nome do elemento a ser criado.
 * @param {string} className - Classe do elemento.
 * @param {string} innerText - Texto do elemento.
 * @returns {Element} Elemento criado.
 */
export const createCustomElement = (element, className, innerText = '') => {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
};

/**
 * Função que recupera o ID do produto passado como parâmetro.
 * @param {Element} product - Elemento do produto.
 * @returns {string} ID do produto.
 */
export const getIdFromProduct = (product) => (
  product.querySelector('span.product__id').innerText
);

/**
 * Função que remove o produto do carrinho.
 * @param {Element} li - Elemento do produto a ser removido do carrinho.
 * @param {string} id - ID do produto a ser removido do carrinho.
 */
const removeCartProduct = async (li, id, span) => {
  li.remove();
  removeCartID(id);
  const productData = await fetchProduct(id);
  const totalPriceEl = document.getElementsByClassName('total-price')[0];
  let totalPrice = parseFloat(totalPriceEl.innerHTML);
  totalPrice -= (productData.price) * Number(span.innerHTML);
  totalPriceEl.innerHTML = totalPrice.toFixed(2);

  const counter = document.getElementById('counter');
  counter.innerHTML = Number(counter.innerHTML) - Number(span.innerHTML);

  localStorage.setItem('counter', JSON.stringify(counter.innerHTML));
  localStorage.setItem('totalPrice', JSON.stringify(totalPriceEl.innerHTML));
};

const removeCartQty = async (li, id, span) => {

  if (Number(span.innerHTML) > 1) {
    removeQty(span.innerHTML, id);
    span.innerHTML = Number(span.innerHTML) - 1;
  } else {
    li.remove();
    removeCartID(id);
  }

  const productData = await fetchProduct(id);
  const totalPriceEl = document.getElementsByClassName('total-price')[0];
  let totalPrice = parseFloat(totalPriceEl.innerHTML);
  totalPrice -= (productData.price);
  totalPriceEl.innerHTML = totalPrice.toFixed(2);

  const counter = document.getElementById('counter');
  counter.innerHTML = Number(counter.innerHTML) - 1;

  localStorage.setItem('counter', JSON.stringify(counter.innerHTML));
  localStorage.setItem('totalPrice', JSON.stringify(totalPriceEl.innerHTML));
}

const addCartQty = async (id, span) => {
  saveQuantity(span.innerHTML, id);
  span.innerHTML = Number(span.innerHTML) + 1;

  const totalPriceEl = document.getElementsByClassName('total-price')[0];
  const counter = document.getElementById('counter');

  const productData = await fetchProduct(id);

  let totalPrice = parseFloat(totalPriceEl.innerHTML);
  totalPrice += productData.price;
  totalPriceEl.innerHTML = totalPrice.toFixed(2);

  let count = Number(counter.innerHTML);
  count += 1;
  counter.innerHTML = count;

  localStorage.setItem('counter', JSON.stringify(counter.innerHTML));
  localStorage.setItem('totalPrice', JSON.stringify(totalPriceEl.innerHTML));
}

/**
 * Função responsável por criar e retornar um product do carrinho.
 * @param {Object} product - Objeto do produto.
 * @param {string} product.id - ID do produto.
 * @param {string} product.title - Título do produto.
 * @param {string} product.price - Preço do produto.
 * @param {string} product.pictures - Imagens do produto.
 * @returns {Element} Elemento de um product do carrinho.
 */
export const createCartProductElement = ({ id, title, price, pictures }) => {
  const li = document.createElement('li');
  li.className = 'cart__product';
  const imgContainer = createCustomElement('div', 'cart__product__image-container');

  const img = createProductImageElement(pictures[0].url);
  imgContainer.appendChild(img);

  const img2 = createProductImageElement((pictures[1] || pictures[0]).url);
  imgContainer.appendChild(img2);

  li.appendChild(imgContainer);

  const infoContainer = createCustomElement('div', 'cart__product__info-container');
  infoContainer.appendChild(createCustomElement('span', 'product__title', title));
  const priceElement = createCustomElement('span', 'product__price', 'R$ ');
  priceElement.appendChild(createCustomElement('span', 'product__price__value', price));
  infoContainer.appendChild(priceElement);

  li.appendChild(infoContainer);

  const removeButton = createCustomElement(
    'i',
    'material-icons cart__product__remove',
    'delete',
  );
  li.appendChild(removeButton);

  const qty = createCustomElement('div', 'qty');
  const removeQty = createCustomElement('button', 'remove-qty', '-');
  qty.appendChild(removeQty);
  const span = createCustomElement('span', 'product-qty', '1');
  qty.appendChild(span);
  const addQty = createCustomElement('button', 'add-qty', '+');
  qty.appendChild(addQty);
  infoContainer.appendChild(qty);

  addQty.addEventListener('click', () => addCartQty(id, span));
  removeQty.addEventListener('click', () => removeCartQty(li, id, span));
  removeButton.addEventListener('click', () => removeCartProduct(li, id, span));

  return li;
};

/**
 * Função responsável por criar e retornar o elemento do produto.
 * @param {Object} product - Objeto do produto.
 * @param {string} product.id - ID do produto.
 * @param {string} product.title - Título do produto.
 * @param {string} product.thumbnail - URL da imagem do produto.
 * @param {number} product.price - Preço do produto.
 * @returns {Element} Elemento de produto.
 */
export const createProductElement = ({ id, title, thumbnail, price }) => {
  const section = document.createElement('section');
  section.className = 'product';

  section.appendChild(createCustomElement('span', 'product__id', id));

  const cartButton = createCustomElement(
    'button',
    'product__add',
    'add_shopping_cart',
  );
  cartButton.classList.add('material-symbols-outlined');
  section.appendChild(cartButton);

  const thumbnailContainer = createCustomElement('div', 'img__container');
  thumbnailContainer.appendChild(createProductImageElement(thumbnail));
  section.appendChild(thumbnailContainer);

  section.appendChild(createCustomElement('span', 'product__title', title));

  const priceElement = createCustomElement('span', 'product__price', 'R$ ');
  priceElement.appendChild(createCustomElement('span', 'product__price__value', price));
  section.appendChild(priceElement);

  return section;
};
