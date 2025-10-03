import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { KanbanColumn } from '../../components/KanbanColumn.jsx';
import { useBoardStore } from '../../stores/boardStore.js';
import { useFetchTasks } from '../../hooks/useFetchTasks.js';

export const ProjectBoard = () => {
  const { 
    activeProject, 
    tasks, 
    columns, 
    getTasksByStatus, 
    reorderTasks,
    createTask 
  } = useBoardStore();
  
  const { isLoading } = useFetchTasks(activeProject?.id);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!active || !over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    // Find the task being dragged
    const activeTask = tasks.find(task => task.id === activeId);
    if (!activeTask) return;

    // Determine new status based on drop target
    let newStatus = activeTask.status;
    if (overId !== activeId && typeof overId === 'string') {
      // If dropped on a column
      if (columns.includes(overId)) {
        newStatus = overId;
      }
    }

    // Get tasks in the target column
    const targetTasks = getTasksByStatus(newStatus);
    const targetIndex = targetTasks.findIndex(task => task.id === overId);
    
    // Calculate new order
    let newOrder = 0;
    if (targetIndex >= 0) {
      newOrder = targetTasks[targetIndex].order;
    } else if (targetTasks.length > 0) {
      newOrder = Math.max(...targetTasks.map(t => t.order)) + 1;
    }

    // Create updated tasks array
    const updatedTasks = tasks.map(task => {
      if (task.id === activeId) {
        return { ...task, status: newStatus, order: newOrder };
      }
      return task;
    });

    // Optimistically update UI
    try {
      await reorderTasks(activeProject.id, updatedTasks);
    } catch (error) {
      console.error('Error reordering tasks:', error);
    }
  };

  const handleAddTask = (status) => {
    setEditingTask({ status, title: '', description: '', assigneeId: null, dueDate: null });
    setShowTaskModal(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask.id) {
        // Update existing task
        // This would be implemented in the board store
        console.log('Updating task:', editingTask.id, taskData);
      } else {
        // Create new task
        await createTask(activeProject.id, taskData);
      }
      setShowTaskModal(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  if (!activeProject) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No project selected
          </h2>
          <p className="text-gray-600">
            Please select a project from the projects list.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="flex space-x-6 overflow-x-auto pb-6">
            {columns.map((column) => {
              const columnTasks = getTasksByStatus(column);
              const columnTitle = column.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ');

              return (
                <SortableContext
                  key={column}
                  items={columnTasks.map(task => task.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <KanbanColumn
                    status={column}
                    title={columnTitle}
                    tasks={columnTasks}
                    onTaskEdit={handleEditTask}
                    onAddTask={handleAddTask}
                  />
                </SortableContext>
              );
            })}
          </div>
        </DndContext>
      </div>

      {/* Task Modal would go here */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {editingTask.id ? 'Edit Task' : 'Create Task'}
            </h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              handleSaveTask({
                title: formData.get('title'),
                description: formData.get('description'),
                status: editingTask.status,
                assigneeId: formData.get('assigneeId') || null,
                dueDate: formData.get('dueDate') || null,
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={editingTask.title}
                    className="input w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    defaultValue={editingTask.description}
                    className="input w-full"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    defaultValue={editingTask.dueDate ? editingTask.dueDate.split('T')[0] : ''}
                    className="input w-full"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  {editingTask.id ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
