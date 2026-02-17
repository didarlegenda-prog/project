import apiClient from './client';

export const reservationsAPI = {
  // Create reservation
  create: async (reservationData) => {
    const response = await apiClient.post('/reservations/', reservationData);
    return response.data;
  },

  // Get all reservations
  getAll: async (params = {}) => {
    const response = await apiClient.get('/reservations/', { params });
    return response.data;
  },

  // Get reservation by ID
  getById: async (reservationId) => {
    const response = await apiClient.get(`/reservations/${reservationId}/`);
    return response.data;
  },

  // Update reservation
  update: async (reservationId, data) => {
    const response = await apiClient.patch(`/reservations/${reservationId}/`, data);
    return response.data;
  },

  // Cancel reservation
  cancel: async (reservationId) => {
    const response = await apiClient.post(`/reservations/${reservationId}/cancel/`);
    return response.data;
  },

  // Get available time slots
  getAvailableSlots: async (restaurantId, date) => {
    const response = await apiClient.get('/reservations/available-slots/', {
      params: { restaurant: restaurantId, date },
    });
    return response.data;
  },

  // Get available tables
  getAvailableTables: async (restaurantId, date, time, guests) => {
    const response = await apiClient.get('/reservations/available-tables/', {
      params: { restaurant: restaurantId, date, time, guests },
    });
    return response.data;
  },
};

export default reservationsAPI;
