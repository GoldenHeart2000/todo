import express from 'express';
import passport from 'passport';
import { googleAuth, googleCallback, logout, getMe } from '../controllers/auth.controller.js';
import { verifyJWT } from '../middleware/auth.js';

const router = express.Router();

// Google OAuth routes
router.get('/google', googleAuth, passport.authenticate('google', { 
  scope: ['profile', 'email'] 
}));

router.get('/google/callback', 
  passport.authenticate('google', { session: false }),
  googleCallback
);

// Logout
router.post('/logout', logout);

// Get current user
router.get('/me', verifyJWT, getMe);

export default router;
