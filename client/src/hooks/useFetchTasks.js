import { useEffect } from 'react';
import { useBoardStore } from '../stores/boardStore.js';

export const useFetchTasks = (projectId) => {
  const { fetchTasks, isLoading } = useBoardStore();

  useEffect(() => {
    if (projectId) {
      fetchTasks(projectId);
    }
  }, [projectId, fetchTasks]);

  return { isLoading };
};
