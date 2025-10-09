import { useState } from 'react';
import { useAuthStore } from '../stores/authStore.js';
import { useBoardStore } from '../stores/boardStore.js';

export const Topbar = () => {
  const { user, logout } = useAuthStore();
  const { activeProject, projects, createProject, setActiveProject } = useBoardStore();
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          {/* Project switcher */}
          {projects?.length > 0 && (
            <select
              value={activeProject?.id || ''}
              onChange={(e) => {
                const proj = projects.find(p => p.id === e.target.value);
                if (proj) setActiveProject(proj);
              }}
              className="ml-2 flex h-9 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Select project</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center justify-center rounded-md bg-blue-600 text-white hover:bg-blue-700 h-9 px-4"
          >
            Create Project
          </button>
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

      {showCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Create Project</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!name.trim()) return;
                try {
                  setIsSubmitting(true);
                  const project = await createProject({ name, description });
                  setActiveProject(project);
                  setShowCreate(false);
                  setName('');
                  setDescription('');
                } catch (e) {
                  console.error(e);
                } finally {
                  setIsSubmitting(false);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="My Project"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-1">
                <button type="button" onClick={() => setShowCreate(false)} className="inline-flex items-center justify-center rounded-md bg-gray-200 text-gray-900 hover:bg-gray-300 h-10 px-4">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center rounded-md bg-blue-600 text-white hover:bg-blue-700 h-10 px-4">
                  {isSubmitting ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
