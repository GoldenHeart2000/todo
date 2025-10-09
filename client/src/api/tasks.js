import { apiClient } from './apiClient.js';

export const tasksApi = {
  getTasks: (projectId) => apiClient.get(`/api/tasks/${projectId}`),
  createTask: (projectId, data) => apiClient.post(`/api/tasks/${projectId}`, data),
  updateTask: (projectId, taskId, data) => apiClient.put(`/api/tasks/${projectId}/${taskId}`, data),
  reorderTasks: (projectId, tasks) => apiClient.put(`/api/tasks/${projectId}/reorder`, { tasks   }),
  deleteTask: (projectId, taskId) => apiClient.delete(`/api/tasks/${projectId}/${taskId}`),
};
