import { sendSuccess, sendError } from '../utils/sendResponse.js';
import { signToken } from '../config/jwt.js';

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

    // Set httpOnly cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    res.cookie(process.env.COOKIE_NAME || 'todo_token', token, cookieOptions);

    // Redirect to frontend
    res.redirect(`${process.env.FRONTEND_URL}/app`);
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  res.clearCookie(process.env.COOKIE_NAME || 'todo_token');
  return sendSuccess(res, null, 'Logged out successfully');
};

export const getMe = (req, res) => {
  return sendSuccess(res, req.user, 'User retrieved successfully');
};
