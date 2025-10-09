import { useDroppable } from '@dnd-kit/core';
import { TaskCard } from './TaskCard.jsx';

export const KanbanColumn = ({ 
  status, 
  title, 
  tasks, 
  onTaskEdit, 
  onAddTask 
}) => {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo':
        return 'bg-gray-100 text-gray-700';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700';
      case 'done':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[400px] w-80 rounded-lg p-4 ${isOver ? 'bg-blue-50' : 'bg-gray-50'}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
            {title}
          </div>
          <span className="text-sm text-gray-500">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAddTask(status)}
          className="text-gray-400 hover:text-gray-600 text-lg"
        >
          +
        </button>
      </div>
      
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onTaskEdit}
          />
        ))}
      </div>
    </div>
  );
};
