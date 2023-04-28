export const getAddress = (cep) => {
  const promise1 = fetch(`https://cep.awesomeapi.com.br/json/${cep}`);
  const promise2 = fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`);

  const promises = [promise1, promise2];

  return Promise.any(promises)
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => error);
};

export const searchCep = async () => {
  const cepInput = document.getElementsByClassName('cep-input')[0];
  const a = document.getElementsByClassName('cart__address')[0];

  const data = await getAddress(cepInput.value);

  if (data.street) {
    a.innerHTML = `${data.street} - ${data.neighborhood} - ${data.city} - ${data.state}`;
  } else if (data.address) {
    a.innerHTML = `${data.address} - ${data.district} - ${data.city} - ${data.state}`;
  } else {
    a.innerHTML = 'CEP não encontrado';
  }
};
