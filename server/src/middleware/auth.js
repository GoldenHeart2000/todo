import { verifyToken } from '../config/jwt.js';
import prisma from '../../prismaClient.js';

export const verifyJWT = async (req, res, next) => {
  try {
    const token = req.cookies[process.env.COOKIE_NAME || 'todo_token'];
    
    if (!token) {
      return res.status(401).json({ 
        error: true, 
        message: 'Access denied. No token provided.',
        code: 'NO_TOKEN'
      });
    }

    const decoded = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: decoded.sub },
    });

    if (!user) {
      return res.status(401).json({ 
        error: true, 
        message: 'Invalid token. User not found.',
        code: 'INVALID_TOKEN'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ 
      error: true, 
      message: 'Invalid token.',
      code: 'INVALID_TOKEN'
    });
  }
};
