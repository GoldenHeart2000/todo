import express from 'express';
import { 
  getTasks, 
  createTask, 
  updateTask, 
  reorderTasks, 
  deleteTask 
} from '../controllers/tasks.controller.js';
import { verifyJWT } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(verifyJWT);

// Get all tasks for project
router.get('/:projectId', getTasks);

// Create new task
router.post('/:projectId', createTask);

// Update task
router.put('/:projectId/:taskId', updateTask);

// Reorder tasks
router.put('/:projectId/reorder', reorderTasks);

// Delete task
router.delete('/:projectId/:taskId', deleteTask);

export default router;
