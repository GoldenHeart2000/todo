import { useBoardStore } from '../stores/boardStore.js';

export const ProjectCard = ({ project }) => {
  const { setActiveProject } = useBoardStore();

  const handleClick = () => {
    setActiveProject(project);
  };

  return (
    <div
      onClick={handleClick}
      className="rounded-lg border border-gray-200 bg-white text-gray-950 shadow-sm p-6 cursor-pointer hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {project.name}
        </h3>
        <span className="text-sm text-gray-500">
          {project._count?.tasks || 0} tasks
        </span>
      </div>
      
      {project.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {project.members?.slice(0, 3).map((member) => (
            <img
              key={member.id}
              src={member.user.avatar || '/default-avatar.png'}
              alt={member.user.name}
              className="h-6 w-6 rounded-full border-2 border-white"
              title={member.user.name}
            />
          ))}
          {project.members?.length > 3 && (
            <div className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-600">
              +{project.members.length - 3}
            </div>
          )}
        </div>
        
        <span className="text-xs text-gray-500">
          {new Date(project.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};
