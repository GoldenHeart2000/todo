import { apiClient } from './apiClient.js';

export const projectsApi = {
  getProjects: () => apiClient.get('/api/projects'),
  getProject: (projectId) => apiClient.get(`/api/projects/${projectId}`),
  createProject: (data) => apiClient.post('/api/projects', data),
  addMember: (projectId, data) => apiClient.post(`/api/projects/${projectId}/members`, data),
  removeMember: (projectId, memberId) => apiClient.delete(`/api/projects/${projectId}/members/${memberId}`),
};
