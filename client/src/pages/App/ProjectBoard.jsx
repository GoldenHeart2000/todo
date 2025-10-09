import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
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
    if (columns.includes(overId)) {
      // Dropped on a column
      newStatus = overId;
    } else {
      // Dropped on another task - find which column it belongs to
      const overTask = tasks.find(task => task.id === overId);
      if (overTask) {
        newStatus = overTask.status;
      }
    }

    // Get current tasks in the target column (excluding the dragged task)
    const targetColumnTasks = tasks
      .filter(t => t.status === newStatus && t.id !== activeId)
      .sort((a, b) => a.order - b.order);

    // Find the position to insert the dragged task
    let insertIndex = targetColumnTasks.length; // Default to end
    if (overId !== activeId && !columns.includes(overId)) {
      // Dropped on another task - insert before it
      const overTaskIndex = targetColumnTasks.findIndex(t => t.id === overId);
      if (overTaskIndex >= 0) {
        insertIndex = overTaskIndex;
      }
    }

    // Create new order for the target column
    const newTargetTasks = [...targetColumnTasks];
    newTargetTasks.splice(insertIndex, 0, { ...activeTask, status: newStatus });

    // Prepare payload for API - only send tasks that need updating
    const tasksToUpdate = [];
    
    // Add the dragged task
    tasksToUpdate.push({
      id: activeId,
      status: newStatus,
      order: insertIndex
    });

    // Update order for tasks that come after the inserted position
    for (let i = insertIndex + 1; i < newTargetTasks.length; i++) {
      tasksToUpdate.push({
        id: newTargetTasks[i].id,
        status: newStatus,
        order: i
      });
    }

    // If moving between columns, reorder the source column
    if (newStatus !== activeTask.status) {
      const sourceColumnTasks = tasks
        .filter(t => t.status === activeTask.status && t.id !== activeId)
        .sort((a, b) => a.order - b.order);
      
      sourceColumnTasks.forEach((task, index) => {
        tasksToUpdate.push({
          id: task.id,
          status: activeTask.status,
          order: index
        });
      });
    }

    try {
      await reorderTasks(activeProject.id, tasksToUpdate);
    } catch (error) {
      console.error('Error reordering tasks:', error);
    }
  };

  const handleAddTask = (status = 'todo') => {
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
        await useBoardStore.getState().updateTask(activeProject.id, editingTask.id, taskData);
      } else {
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Board</h2>
          <button
            onClick={() => handleAddTask('todo')}
            className="inline-flex items-center justify-center rounded-md bg-blue-600 text-white hover:bg-blue-700 h-9 px-4"
          >
            New Task
          </button>
        </div>
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
                <SortableContext key={column} items={columnTasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl border border-gray-100">
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
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={editingTask.status}
                    onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="todo">Todo</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    defaultValue={editingTask.dueDate ? editingTask.dueDate.split('T')[0] : ''}
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="inline-flex items-center justify-center rounded-md bg-gray-200 text-gray-900 hover:bg-gray-300 h-10 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-md bg-blue-600 text-white hover:bg-blue-700 h-10 px-4"
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
