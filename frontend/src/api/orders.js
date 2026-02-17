import apiClient from './client';

export const ordersAPI = {
  // Create new order
  create: async (orderData) => {
    const response = await apiClient.post('/orders/', orderData);
    return response.data;
  },

  // Get all orders
  getAll: async (params = {}) => {
    const response = await apiClient.get('/orders/', { params });
    return response.data;
  },

  // Get order by ID
  getById: async (orderId) => {
    const response = await apiClient.get(`/orders/${orderId}/`);
    return response.data;
  },

  // Cancel order
  cancel: async (orderId) => {
    const response = await apiClient.post(`/orders/${orderId}/cancel/`);
    return response.data;
  },

  // Track order
  track: async (orderId) => {
    const response = await apiClient.get(`/orders/${orderId}/track/`);
    return response.data;
  },

  // Get order history
  getHistory: async (params = {}) => {
    const response = await apiClient.get('/orders/history/', { params });
    return response.data;
  },
};

export default ordersAPI;
