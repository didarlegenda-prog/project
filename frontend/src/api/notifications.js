import apiClient from './client';

export const notificationsAPI = {
  // Get all notifications
  getAll: async (params = {}) => {
    const response = await apiClient.get('/notifications/', { params });
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    const response = await apiClient.post(`/notifications/${notificationId}/mark-as-read/`);
    return response.data;
  },

  // Mark all as read
  markAllAsRead: async () => {
    const response = await apiClient.post('/notifications/mark-all-as-read/');
    return response.data;
  },

  // Get unread count
  getUnreadCount: async () => {
    const response = await apiClient.get('/notifications/unread-count/');
    return response.data;
  },

  // Get notification settings
  getSettings: async () => {
    const response = await apiClient.get('/notifications/settings/');
    return response.data;
  },

  // Update notification settings
  updateSettings: async (settings) => {
    const response = await apiClient.put('/notifications/settings/', settings);
    return response.data;
  },
};

export default notificationsAPI;
