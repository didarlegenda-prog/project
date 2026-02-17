import apiClient from './client';

export const menuAPI = {
  // Get menu categories for a restaurant
  getCategories: async (restaurantId) => {
    const response = await apiClient.get('/menu/categories/', {
      params: { restaurant: restaurantId },
    });
    return response.data;
  },

  // Get menu items for a restaurant
  getItems: async (restaurantId, categoryId = null) => {
    const params = { restaurant: restaurantId };
    if (categoryId) {
      params.category = categoryId;
    }
    const response = await apiClient.get('/menu/items/', { params });
    return response.data;
  },

  // Get single menu item
  getItem: async (itemId) => {
    const response = await apiClient.get(`/menu/items/${itemId}/`);
    return response.data;
  },

  // Get nutritional info
  getNutritionalInfo: async (itemId) => {
    const response = await apiClient.get(`/menu/items/${itemId}/nutritional-info/`);
    return response.data;
  },
};

export default menuAPI;
