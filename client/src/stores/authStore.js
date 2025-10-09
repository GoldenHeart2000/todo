import { create } from 'zustand';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const useAuthStore = create((set, get) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,

  // Begin Google OAuth (redirect-based)
  login: () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  },

  logout: async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      set({ user: null, isAuthenticated: false });
      window.location.href = '/login';
    }
  },

  // Populate auth from cookie (used on initial load and route guards)
  refresh: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch(`${API_BASE_URL}/api/me`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Unauthorized');
      const json = await res.json();
      if (json?.success && json?.data) {
        set({ user: json.data, isAuthenticated: true, isLoading: false });
        return json.data;
      }
      set({ user: null, isAuthenticated: false, isLoading: false });
      return null;
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
      return null;
    }
  },
}));
