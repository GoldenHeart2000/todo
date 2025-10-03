import { create } from 'zustand';
import { authApi } from '../api/auth.js';

export const useAuthStore = create((set, get) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,

  login: async (userData) => {
    set({ user: userData, isAuthenticated: true });
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      set({ user: null, isAuthenticated: false });
    }
  },

  refresh: async () => {
    set({ isLoading: true });
    try {
      const response = await authApi.getMe();
      if (response.success) {
        set({ 
          user: response.data, 
          isAuthenticated: true,
          isLoading: false 
        });
      } else {
        set({ 
          user: null, 
          isAuthenticated: false,
          isLoading: false 
        });
      }
    } catch (error) {
      console.error('Auth refresh error:', error);
      set({ 
        user: null, 
        isAuthenticated: false,
        isLoading: false 
      });
    }
  },

  setLoading: (loading) => set({ isLoading: loading }),
}));
