/**
 * API — central HTTP client
 */
const BASE_URL =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : '';

async function request(path, { token, ...opts } = {}) {
  const url = `${BASE_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(opts.headers || {}),
  };
  const res = await fetch(url, { ...opts, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.errors?.[0] || data.message || 'Request failed');
  return data;
}

function auth(token) {
  return {
    login(email, password)          { return request('/api/auth/login', { method: 'POST', token: undefined, body: JSON.stringify({ email, password }) }); },
    register(body)                  { return request('/api/auth/register', { method: 'POST', token: undefined, body: JSON.stringify(body) }); },
    me(token)                       { return request('/api/auth/me', { token }); },
  };
}

function catalog(token) {
  return {
    list(filters = {})      { const q = new URLSearchParams(filters).toString(); return request(`/api/products${q ? '?' + q : ''}`, { token }); },
    meta()                  { return request('/api/products/meta', {}); },
  };
}

function products(token) {
  return {
    create(body)   { return request('/api/products', { token, method: 'POST', body: JSON.stringify(body) }); },
    update(id, body)  { return request(`/api/products/${id}`, { token, method: 'PUT', body: JSON.stringify(body) }); },
    remove(id)      { return request(`/api/products/${id}`, { token, method: 'DELETE' }); },
  };
}

function orders(token) {
  return {
    list()               { return request('/api/orders', { token }); },
    create(body)         { return request('/api/orders', { token, method: 'POST', body: JSON.stringify(body) }); },
    updateStatus(id, s)  { return request(`/api/orders/${id}/status`, { token, method: 'PATCH', body: JSON.stringify({ status: s }) }); },
  };
}

function messages(token) {
  return {
    listConversations() { return request('/api/messages/conversations', { token }); },
    listMessages(convId) { return request(`/api/messages/conversations/${convId}`, { token }); },
    send(body)          { return request('/api/messages', { token, method: 'POST', body: JSON.stringify(body) }); },
  };
}

function dashboard(token) {
  return {
    get() { return request('/api/dashboard', { token }); },
  };
}

export const authApi = auth();
export const catalogApi = catalog();
export const productsApi = products();
export const ordersApi = orders();
export const messagesApi = messages();
export const dashboardApi = dashboard();
export default { auth: authApi, catalog: catalogApi, products: productsApi, orders: ordersApi, messages: messagesApi, dashboard: dashboardApi };
