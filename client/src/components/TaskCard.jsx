import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useBoardStore } from '../stores/boardStore.js';
import { formatDate, isOverdue } from '../utils/date.js';

export const TaskCard = ({ task, onEdit }) => {
  const { deleteTask, activeProject } = useBoardStore();
  const [isHovered, setIsHovered] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(activeProject.id, task.id);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(task);
  };

  const isTaskOverdue = isOverdue(task.dueDate);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`cursor-pointer rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md ${isTaskOverdue ? 'border-red-300 bg-red-50' : ''} ${isDragging ? 'opacity-70' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleEdit}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            {...attributes}
            {...listeners}
            className="inline-flex h-4 w-3 cursor-grab active:cursor-grabbing select-none text-gray-400"
            title="Drag"
          >
            
            ≡
          </span>
          <h4 className="font-medium text-gray-900 text-sm">
            {task.title}
          </h4>
        </div>
        {isHovered && (
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 text-xs"
          >
            ×
          </button>
        )}
      </div>
      
      {task.description && (
        <p className="text-gray-600 text-xs mb-3 line-clamp-2">
          {task.description}
        </p>
      )}
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-2">
          {task.assignee && (
            <div className="flex items-center space-x-1">
              <img
                src={task.assignee.avatar || '/default-avatar.png'}
                alt={task.assignee.name}
                className="h-4 w-4 rounded-full"
              />
              <span>{task.assignee.name}</span>
            </div>
          )}
        </div>
        
        {task.dueDate && (
          <span className={`text-xs ${isTaskOverdue ? 'text-red-600 font-medium' : ''}`}>
            {formatDate(task.dueDate)}
          </span>
        )}
      </div>
    </div>
  );
};
