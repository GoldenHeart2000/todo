import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { Login } from './pages/Auth/Login.jsx';
import { ProjectsList } from './pages/App/ProjectsList.jsx';
import { ProjectBoard } from './pages/App/ProjectBoard.jsx';
import { ProjectSettings } from './pages/App/ProjectSettings.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { Topbar } from './components/Topbar.jsx';
import { useAuthStore } from './stores/authStore.js';
import { useBoardStore } from './stores/boardStore.js';

function App() {
  const { isAuthenticated, refresh } = useAuthStore();
  const { initializeAfterAuth } = useBoardStore();

  useEffect(() => {
    (async () => {
      const user = await refresh();
      if (user) await initializeAfterAuth();
    })();
  }, []);

  return (
    <Router>
      <div className="App">
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-50">
                  <Topbar />
                  <Routes>
                    <Route index element={<ProjectBoard />} />
                    <Route path="projects" element={<ProjectsList />} />
                    <Route path="settings" element={<ProjectSettings />} />
                  </Routes>
                </div>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/app" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
