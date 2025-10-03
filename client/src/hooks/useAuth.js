import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore.js';

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, refresh, logout } = useAuthStore();

  useEffect(() => {
    // Check if user is already authenticated on app load
    if (!isAuthenticated && !isLoading) {
      refresh();
    }
  }, [isAuthenticated, isLoading, refresh]);

  return {
    user,
    isAuthenticated,
    isLoading,
    logout,
    refresh
  };
};
