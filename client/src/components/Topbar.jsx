import { useAuthStore } from '../stores/authStore.js';
import { useBoardStore } from '../stores/boardStore.js';

export const Topbar = () => {
  const { user, logout } = useAuthStore();
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
              <button onClick={logout} className="inline-flex items-center justify-center rounded-md bg-gray-200 text-gray-900 hover:bg-gray-300 h-8 px-3 text-xs">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
