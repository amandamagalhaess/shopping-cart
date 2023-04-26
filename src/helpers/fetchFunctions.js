export const fetchProduct = (id) => {
  const endpoint = `https://api.mercadolibre.com/items/${id}`;

  if (id === undefined) {
    return Promise.reject(new Error('ID não informado'));
  }

  return fetch(endpoint)
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => error.message);
};

export const fetchProductsList = (searchTerm) => {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${searchTerm}`;

  if (searchTerm === undefined) {
    throw new Error('Termo de busca não informado');
  }

  return fetch(endpoint)
    .then((response) => response.json())
    .then((data) => data.results)
    .catch((error) => console.log(error.message));
};
