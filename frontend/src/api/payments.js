import apiClient from './client';

export const paymentsAPI = {
  // Create payment intent
  createPaymentIntent: async (paymentData) => {
    const response = await apiClient.post('/payments/', paymentData);
    return response.data;
  },

  // Confirm payment
  confirmPayment: async (paymentId, confirmData) => {
    const response = await apiClient.post(`/payments/${paymentId}/confirm/`, confirmData);
    return response.data;
  },

  // Get payment status
  getStatus: async (paymentId) => {
    const response = await apiClient.get(`/payments/${paymentId}/`);
    return response.data;
  },

  // Get payment methods
  getPaymentMethods: async () => {
    const response = await apiClient.get('/payments/methods/');
    return response.data;
  },
};

export default paymentsAPI;
