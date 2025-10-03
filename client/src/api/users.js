import { apiClient } from './apiClient.js';

export const usersApi = {
  getProjectMembers: (projectId) => apiClient.get(`/api/users/${projectId}`),
};
