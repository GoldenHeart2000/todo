import express from 'express';
import { getUsers } from '../controllers/users.controller.js';
import { verifyJWT } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(verifyJWT);

// Get project members
router.get('/:projectId', getUsers);

export default router;
