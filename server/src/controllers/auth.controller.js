import { sendSuccess, sendError } from '../utils/sendResponse.js';
import { signToken } from '../config/jwt.js';
import 'dotenv/config'
export const googleAuth = (req, res, next) => {
  // This will be handled by passport middleware
  next();
};

export const googleCallback = async (req, res, next) => {
  try {
    const user = req.user;
    
    if (!user) {
      return sendError(res, 'Authentication failed', 401, 'AUTH_FAILED');
    }

    // Sign JWT token
    const token = signToken({ sub: user.id });

    // Set httpOnly cookie with proper cross-site options so browsers accept it
    const cookieOptions = {
      httpOnly: true,
      // For OAuth redirects (cross-site), browsers require SameSite=None and Secure
      sameSite: 'none',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    };

    res.cookie('todo_token', token, cookieOptions);

    // Redirect to frontend
    res.redirect(`${process.env.FRONTEND_URL}/app`);
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  res.clearCookie('todo_token');
  return sendSuccess(res, null, 'Logged out successfully');
};

export const getMe = (req, res) => {
  return sendSuccess(res, req.user, 'User retrieved successfully');
};
