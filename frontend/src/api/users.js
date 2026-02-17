import apiClient from './client';

export const usersAPI = {
  // Get user profile
  getProfile: async () => {
    const response = await apiClient.get('/auth/me/');
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await apiClient.patch('/auth/me/', profileData);
    return response.data;
  },

  // Upload profile image
  uploadImage: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    const response = await apiClient.post('/auth/me/upload-image/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update preferences
  updatePreferences: async (preferences) => {
    const response = await apiClient.patch('/auth/me/preferences/', preferences);
    return response.data;
  },

  // Get user addresses
  getAddresses: async () => {
    const response = await apiClient.get('/auth/addresses/');
    return response.data;
  },
};

export default usersAPI;
