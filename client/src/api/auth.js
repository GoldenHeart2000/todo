import { apiClient } from './apiClient.js';

export const authApi = {
  getMe: () => apiClient.get('/api/me'),
  logout: () => apiClient.post('/auth/logout'),
  getGoogleAuthUrl: () => `${apiClient.baseURL}/auth/google`,
};
