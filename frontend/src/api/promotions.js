import apiClient from './client';

export const promotionsAPI = {
  // Validate promo code
  validate: async (code, orderData) => {
    const response = await apiClient.post('/promotions/validate/', {
      code,
      ...orderData,
    });
    return response.data;
  },

  // Apply promo code
  apply: async (code, orderId) => {
    const response = await apiClient.post('/promotions/apply/', {
      code,
      order: orderId,
    });
    return response.data;
  },

  // Get active promotions
  getActive: async () => {
    const response = await apiClient.get('/promotions/active/');
    return response.data;
  },
};

export default promotionsAPI;
