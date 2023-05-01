/**
 * Função que retorna todos os itens do carrinho salvos no localStorage.
 * @returns {Array} Itens de ids salvos do carrinho ou array vazio.
 */
export const getSavedCartIDs = () => {
  const cartProducts = localStorage.getItem('cartProducts');
  return cartProducts ? JSON.parse(cartProducts) : [];
};

/**
 * Função que adiciona um product ao carrinho.
 * @param {string} id - ID do product a ser adicionado.
 */
export const saveCartID = (id) => {
  if (!id) throw new Error('Você deve fornecer um ID');

  const cartProducts = getSavedCartIDs();
  const newCartProducts = [...cartProducts, id];
  localStorage.setItem('cartProducts', JSON.stringify(newCartProducts));

  localStorage.setItem('quantity', JSON.stringify([...getSavedQuantity(), 1]));
};

/**
 * Função que remove um product do carrinho.
 * @param {string} id - ID do product a ser removido.
 */
export const removeCartID = (id) => {
  if (!id) throw new Error('Você deve fornecer um ID');

  const cartProducts = [...getSavedCartIDs()];
  const indexProduct = cartProducts.indexOf(id);
  cartProducts.splice(indexProduct, 1);
  localStorage.setItem('cartProducts', JSON.stringify(cartProducts));

  const quantity = [...getSavedQuantity()];
  quantity.splice(indexProduct, 1);
  localStorage.setItem('quantity', JSON.stringify(quantity));
};

export const getSavedQuantity = () => {
  const quantity = localStorage.getItem('quantity');
  return quantity ? JSON.parse(quantity) : [];
};

export const saveQuantity = (span, id) => {

  const cartProducts = [...getSavedCartIDs()];
  const indexProduct = cartProducts.indexOf(id);

  const quantity = getSavedQuantity();

  const quantityPlus = quantity.map((q, index) => {
    if (index == indexProduct) {
      return Number(q) + 1;
    }
    return Number(q);
  });

  const newQuantity = [...quantityPlus];
  localStorage.setItem('quantity', JSON.stringify(newQuantity));
};

export const removeQty = (span, id) => {

  const cartProducts = [...getSavedCartIDs()];
  const indexProduct = cartProducts.indexOf(id);

  const quantity = getSavedQuantity();

  const quantityPlus = quantity.map((q, index) => {
    if (index == indexProduct) {
      return Number(q) - 1;
    }
    return Number(q);
  });

  const newQuantity = [...quantityPlus];
  localStorage.setItem('quantity', JSON.stringify(newQuantity));
};