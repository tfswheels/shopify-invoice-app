import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Auth API
export const authApi = {
  verify: async (shop) => {
    const { data } = await api.get('/auth/verify', {
      params: { shop }
    });
    return data;
  }
};

// Orders API
export const ordersApi = {
  getAll: async (shop, params = {}) => {
    const { data } = await api.get('/api/orders', {
      params: { shop, ...params }
    });
    return data;
  },

  getById: async (shop, orderId) => {
    const { data } = await api.get(`/api/orders/${orderId}`, {
      params: { shop }
    });
    return data;
  }
};

export default api;
