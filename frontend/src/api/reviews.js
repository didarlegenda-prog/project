import apiClient from './client';

export const reviewsAPI = {
  // Create review
  create: async (reviewData) => {
    const response = await apiClient.post('/reviews/', reviewData);
    return response.data;
  },

  // Get reviews for restaurant
  getByRestaurant: async (restaurantId, params = {}) => {
    const response = await apiClient.get('/reviews/', {
      params: { restaurant: restaurantId, ...params },
    });
    return response.data;
  },

  // Get review by ID
  getById: async (reviewId) => {
    const response = await apiClient.get(`/reviews/${reviewId}/`);
    return response.data;
  },

  // Update review
  update: async (reviewId, reviewData) => {
    const response = await apiClient.patch(`/reviews/${reviewId}/`, reviewData);
    return response.data;
  },

  // Delete review
  delete: async (reviewId) => {
    const response = await apiClient.delete(`/reviews/${reviewId}/`);
    return response.data;
  },

  // Get user's reviews
  getUserReviews: async () => {
    const response = await apiClient.get('/reviews/my-reviews/');
    return response.data;
  },
};

export default reviewsAPI;
