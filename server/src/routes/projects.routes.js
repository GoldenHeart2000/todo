import express from 'express';
import { 
  getProjects, 
  createProject, 
  getProject, 
  addMember, 
  removeMember 
} from '../controllers/projects.controller.js';
import { verifyJWT } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(verifyJWT);

// Get all projects for user
router.get('/', getProjects);

// Create new project
router.post('/', createProject);

// Get specific project
router.get('/:projectId', getProject);

// Add member to project
router.post('/:projectId/members', addMember);

// Remove member from project
router.delete('/:projectId/members/:memberId', removeMember);

export default router;
