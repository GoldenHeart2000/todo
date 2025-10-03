import { useAuth } from '../hooks/useAuth.js';
import { useBoardStore } from '../stores/boardStore.js';

export const Topbar = () => {
  const { user, logout } = useAuth();
  const { activeProject } = useBoardStore();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900">
            {activeProject ? activeProject.name : 'Collaborative TODO'}
          </h1>
          {activeProject && (
            <span className="text-sm text-gray-500">
              {activeProject.description}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center space-x-3">
              <img
                src={user.avatar || '/default-avatar.png'}
                alt={user.name}
                className="h-8 w-8 rounded-full"
              />
              <span className="text-sm font-medium text-gray-700">
                {user.name}
              </span>
              <button
                onClick={logout}
                className="btn btn-sm btn-secondary"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
