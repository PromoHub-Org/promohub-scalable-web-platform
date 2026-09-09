// PromoHub Frontend API Client Service Layer
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to construct authorization headers with stored JWT token
const getAuthHeaders = () => {
  const token = localStorage.getItem('promohub_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

// Generic HTTP fetch wrapper
const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {})
    }
  };

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `HTTP error ${response.status}`);
  }

  return data;
};

// Authentication API Services
export const authAPI = {
  register: (name, email, password) => 
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    }),

  login: (email, password) => 
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
};

// Deals & Flash Sales API Services
export const dealsAPI = {
  getAll: () => request('/deals'),

  getById: (id) => request(`/deals/${id}`),

  claimDeal: (id) => request(`/deals/${id}/claim`, { method: 'POST' })
};

// User Claims Wallet API Services
export const claimsAPI = {
  getMyClaims: () => request('/me/claims')
};

// Admin Management API Services
export const adminAPI = {
  getStats: () => request('/admin/stats'),

  getClaimsLedger: () => request('/admin/claims'),

  getUsers: () => request('/admin/users'),

  createDeal: (dealData) => request('/admin/deals', {
    method: 'POST',
    body: JSON.stringify(dealData)
  }),

  updateDeal: (id, dealData) => request(`/admin/deals/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dealData)
  }),

  deleteDeal: (id) => request(`/admin/deals/${id}`, {
    method: 'DELETE'
  })
};
