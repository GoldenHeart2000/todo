import { create } from 'zustand';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const useBoardStore = create((set, get) => ({
  projects: [],
  activeProject: null,
  tasks: [],
  members: [],
  columns: ['todo', 'in-progress', 'done'],
  isLoading: false,

  // Initialize board after successful auth
  initializeAfterAuth: async () => {
    await get().fetchProjects();
    const { projects } = get();
    if (projects.length > 0) {
      get().setActiveProject(projects[0]);
    }
  },

  // Projects
  fetchProjects: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch(`${API_BASE_URL}/api/projects`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch projects');
      const json = await res.json();
      if (json?.success) set({ projects: json.data, isLoading: false });
      else set({ isLoading: false });
    } catch (error) {
      console.error('Error fetching projects:', error);
      set({ isLoading: false });
    }
  },

  createProject: async (data) => {
    const res = await fetch(`${API_BASE_URL}/api/projects`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create project');
    const json = await res.json();
    set(state => ({ projects: [json.data, ...state.projects] }));
    return json.data;
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
      const res = await fetch(`${API_BASE_URL}/api/tasks/${projectId}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const json = await res.json();
      if (json?.success) set({ tasks: json.data, isLoading: false });
      else set({ isLoading: false });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      set({ isLoading: false });
    }
  },

  createTask: async (projectId, taskData) => {
    const res = await fetch(`${API_BASE_URL}/api/tasks/${projectId}`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });
    if (!res.ok) throw new Error('Failed to create task');
    const json = await res.json();
    set(state => ({ tasks: [...state.tasks, json.data] }));
    return json.data;
  },

  updateTask: async (projectId, taskId, taskData) => {
    const res = await fetch(`${API_BASE_URL}/api/tasks/${projectId}/${taskId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });
    if (!res.ok) throw new Error('Failed to update task');
    const json = await res.json();
    set(state => ({ tasks: state.tasks.map(t => (t.id === taskId ? json.data : t)) }));
    return json.data;
  },

  deleteTask: async (projectId, taskId) => {
    const res = await fetch(`${API_BASE_URL}/api/tasks/${projectId}/${taskId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to delete task');
    set(state => ({ tasks: state.tasks.filter(t => t.id !== taskId) }));
  },

  reorderTasks: async (projectId, reorderedTasks) => {
    // Optimistic update
    const prev = get().tasks;
    set({ tasks: reorderedTasks });
    try {
      const payload = reorderedTasks.map(t => ({ id: t.id, status: t.status, order: t.order }));
      const res = await fetch(`${API_BASE_URL}/api/tasks/${projectId}/reorder`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks: payload }),
      });
      if (!res.ok) throw new Error('Failed to reorder');
    } catch (e) {
      console.error(e);
      set({ tasks: prev });
    }
  },

  // Members
  fetchMembers: async (projectId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/${projectId}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch members');
      const json = await res.json();
      if (json?.success) set({ members: json.data });
    } catch (e) {
      console.error(e);
    }
  },

  addMember: async (projectId, data) => {
    const res = await fetch(`${API_BASE_URL}/api/projects/${projectId}/members`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to add member');
    const json = await res.json();
    set(state => ({ members: [...state.members, json.data] }));
    return json.data;
  },

  removeMember: async (projectId, memberId) => {
    const res = await fetch(`${API_BASE_URL}/api/projects/${projectId}/members/${memberId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to remove member');
    set(state => ({ members: state.members.filter(m => m.id !== memberId) }));
  },

  // Helpers
  getTasksByStatus: (status) => {
    const { tasks } = get();
    return tasks.filter(t => t.status === status).sort((a, b) => a.order - b.order);
  },
}));
