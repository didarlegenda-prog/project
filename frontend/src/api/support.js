import apiClient from './client';

export const supportAPI = {
  // Create support ticket
  create: async (ticketData) => {
    const response = await apiClient.post('/support/tickets/', ticketData);
    return response.data;
  },

  // Get all tickets
  getAll: async (params = {}) => {
    const response = await apiClient.get('/support/tickets/', { params });
    return response.data;
  },

  // Get ticket by ID
  getById: async (ticketId) => {
    const response = await apiClient.get(`/support/tickets/${ticketId}/`);
    return response.data;
  },

  // Add comment to ticket
  addComment: async (ticketId, commentData) => {
    const response = await apiClient.post(`/support/tickets/${ticketId}/comments/`, commentData);
    return response.data;
  },

  // Get ticket comments
  getComments: async (ticketId) => {
    const response = await apiClient.get(`/support/tickets/${ticketId}/comments/`);
    return response.data;
  },

  // Close ticket
  close: async (ticketId) => {
    const response = await apiClient.post(`/support/tickets/${ticketId}/close/`);
    return response.data;
  },
};

export default supportAPI;
