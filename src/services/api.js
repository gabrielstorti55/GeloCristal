const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (response.status === 204) return null;

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message = data?.message || 'Falha na comunicacao com o servidor.';
    throw new Error(message);
  }

  return data;
}

export const api = {
  listClientes: () => request('/clientes'),
  createCliente: (payload) => request('/clientes', { method: 'POST', body: JSON.stringify(payload) }),
  updateCliente: (id, payload) => request(`/clientes/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteCliente: (id) => request(`/clientes/${id}`, { method: 'DELETE' }),

  listVendas: () => request('/vendas'),
  createVenda: (payload) => request('/vendas', { method: 'POST', body: JSON.stringify(payload) }),
  updateVenda: (id, payload) => request(`/vendas/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteVenda: (id) => request(`/vendas/${id}`, { method: 'DELETE' }),
};
