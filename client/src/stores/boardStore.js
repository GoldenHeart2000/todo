import { create } from 'zustand';
import { projectsApi, tasksApi, usersApi } from '../api/index.js';

export const useBoardStore = create((set, get) => ({
  projects: [],
  activeProject: null,
  tasks: [],
  members: [],
  columns: ['todo', 'in-progress', 'done'],
  isLoading: false,

  // Projects
  fetchProjects: async () => {
    set({ isLoading: true });
    try {
      const response = await projectsApi.getProjects();
      if (response.success) {
        set({ projects: response.data, isLoading: false });
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      set({ isLoading: false });
    }
  },

  setActiveProject: (project) => {
    set({ activeProject: project });
    if (project) {
      get().fetchTasks(project.id);
      get().fetchMembers(project.id);
    }
  },

  // Tasks
  fetchTasks: async (projectId) => {
    set({ isLoading: true });
    try {
      const response = await tasksApi.getTasks(projectId);
      if (response.success) {
        set({ tasks: response.data, isLoading: false });
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      set({ isLoading: false });
    }
  },

  createTask: async (projectId, taskData) => {
    try {
      const response = await tasksApi.createTask(projectId, taskData);
      if (response.success) {
        set(state => ({
          tasks: [...state.tasks, response.data]
        }));
        return response.data;
      }
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  updateTask: async (projectId, taskId, taskData) => {
    try {
      const response = await tasksApi.updateTask(projectId, taskId, taskData);
      if (response.success) {
        set(state => ({
          tasks: state.tasks.map(task => 
            task.id === taskId ? response.data : task
          )
        }));
        return response.data;
      }
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  deleteTask: async (projectId, taskId) => {
    try {
      const response = await tasksApi.deleteTask(projectId, taskId);
      if (response.success) {
        set(state => ({
          tasks: state.tasks.filter(task => task.id !== taskId)
        }));
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },

  reorderTasks: async (projectId, reorderedTasks) => {
    try {
      // Optimistic update
      set({ tasks: reorderedTasks });
      
      const response = await tasksApi.reorderTasks(projectId, reorderedTasks);
      if (!response.success) {
        // Revert on error
        get().fetchTasks(projectId);
        throw new Error('Failed to reorder tasks');
      }
    } catch (error) {
      console.error('Error reordering tasks:', error);
      // Revert on error
      get().fetchTasks(projectId);
      throw error;
    }
  },

  // Members
  fetchMembers: async (projectId) => {
    try {
      const response = await usersApi.getProjectMembers(projectId);
      if (response.success) {
        set({ members: response.data });
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  },

  addMember: async (projectId, memberData) => {
    try {
      const response = await projectsApi.addMember(projectId, memberData);
      if (response.success) {
        set(state => ({
          members: [...state.members, response.data]
        }));
        return response.data;
      }
    } catch (error) {
      console.error('Error adding member:', error);
      throw error;
    }
  },

  removeMember: async (projectId, memberId) => {
    try {
      const response = await projectsApi.removeMember(projectId, memberId);
      if (response.success) {
        set(state => ({
          members: state.members.filter(member => member.id !== memberId)
        }));
      }
    } catch (error) {
      console.error('Error removing member:', error);
      throw error;
    }
  },

  // Helper functions
  getTasksByStatus: (status) => {
    const { tasks } = get();
    return tasks.filter(task => task.status === status).sort((a, b) => a.order - b.order);
  },

  getTaskById: (taskId) => {
    const { tasks } = get();
    return tasks.find(task => task.id === taskId);
  },

  getMemberById: (memberId) => {
    const { members } = get();
    return members.find(member => member.id === memberId);
  },

  getUserRole: (userId) => {
    const { members } = get();
    const member = members.find(member => member.user.id === userId);
    return member?.role || null;
  },
}));
