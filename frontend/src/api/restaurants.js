import apiClient from './client';

export const restaurantsAPI = {
  // Get all restaurants
  getAll: async (params = {}) => {
    const response = await apiClient.get('/restaurants/', { params });
    return response.data;
  },

  // Get restaurant by slug
  getBySlug: async (slug) => {
    const response = await apiClient.get(`/restaurants/${slug}/`);
    return response.data;
  },

  // Search restaurants
  search: async (query, filters = {}) => {
    const response = await apiClient.get('/restaurants/', {
      params: { search: query, ...filters },
    });
    return response.data;
  },
};

export default restaurantsAPI;
