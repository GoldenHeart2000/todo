import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Login } from './pages/Auth/Login.jsx';
import { ProjectsList } from './pages/App/ProjectsList.jsx';
import { ProjectBoard } from './pages/App/ProjectBoard.jsx';
import { ProjectSettings } from './pages/App/ProjectSettings.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { Topbar } from './components/Topbar.jsx';

function App() {
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
                    <Route index element={<ProjectsList />} />
                    <Route path="board" element={<ProjectBoard />} />
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
