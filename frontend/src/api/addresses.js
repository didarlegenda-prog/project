import apiClient from './client';

export const addressesAPI = {
  // Get all addresses
  getAll: async () => {
    const response = await apiClient.get('/auth/addresses/');
    return response.data;
  },

  // Get address by ID
  getById: async (addressId) => {
    const response = await apiClient.get(`/auth/addresses/${addressId}/`);
    return response.data;
  },

  // Create address
  create: async (addressData) => {
    const response = await apiClient.post('/auth/addresses/', addressData);
    return response.data;
  },

  // Update address
  update: async (addressId, addressData) => {
    const response = await apiClient.patch(`/auth/addresses/${addressId}/`, addressData);
    return response.data;
  },

  // Delete address
  delete: async (addressId) => {
    const response = await apiClient.delete(`/auth/addresses/${addressId}/`);
    return response.data;
  },

  // Set default address
  setDefault: async (addressId) => {
    const response = await apiClient.post(`/auth/addresses/${addressId}/set-default/`);
    return response.data;
  },
};

export default addressesAPI;
