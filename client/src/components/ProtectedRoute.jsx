import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore.js';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, refresh } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      refresh();
    }
  }, [isAuthenticated, refresh]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-gray-300 border-t-blue-600 animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
