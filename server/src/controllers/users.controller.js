import { sendSuccess, sendError } from '../utils/sendResponse.js';
import prisma from '../../prismaClient.js';

export const getUsers = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    // Check if user has access to project
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        members: {
          some: {
            userId: req.user.id
          }
        }
      }
    });

    if (!project) {
      return sendError(res, 'Project not found', 404, 'NOT_FOUND');
    }

    // Get all project members
    const members = await prisma.projectMember.findMany({
      where: { projectId },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatar: true }
        }
      },
      orderBy: { addedAt: 'asc' }
    });

    return sendSuccess(res, members, 'Project members retrieved successfully');
  } catch (error) {
    next(error);
  }
};
