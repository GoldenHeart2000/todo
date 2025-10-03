import { sendSuccess, sendError } from '../utils/sendResponse.js';
import prisma from '../../prismaClient.js';

export const getProjects = async (req, res, next) => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        members: {
          some: {
            userId: req.user.id
          }
        }
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true, avatar: true }
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, avatar: true }
            }
          }
        },
        _count: {
          select: { tasks: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return sendSuccess(res, projects, 'Projects retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return sendError(res, 'Project name is required', 400, 'VALIDATION_ERROR');
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        createdById: req.user.id,
        members: {
          create: {
            userId: req.user.id,
            role: 'creator'
          }
        }
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true, avatar: true }
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, avatar: true }
            }
          }
        }
      }
    });

    return sendSuccess(res, project, 'Project created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        members: {
          some: {
            userId: req.user.id
          }
        }
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true, avatar: true }
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, avatar: true }
            }
          }
        },
        tasks: {
          include: {
            assignee: {
              select: { id: true, name: true, email: true, avatar: true }
            },
            createdBy: {
              select: { id: true, name: true, email: true, avatar: true }
            }
          },
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!project) {
      return sendError(res, 'Project not found', 404, 'NOT_FOUND');
    }

    return sendSuccess(res, project, 'Project retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const addMember = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { email, role = 'member' } = req.body;

    if (!email) {
      return sendError(res, 'Email is required', 400, 'VALIDATION_ERROR');
    }

    // Check if user has permission to add members
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        members: {
          some: {
            userId: req.user.id,
            role: { in: ['creator', 'admin'] }
          }
        }
      }
    });

    if (!project) {
      return sendError(res, 'Project not found or insufficient permissions', 404, 'NOT_FOUND');
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return sendError(res, 'User not found', 404, 'USER_NOT_FOUND');
    }

    // Check if user is already a member
    const existingMember = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: user.id
        }
      }
    });

    if (existingMember) {
      return sendError(res, 'User is already a member of this project', 400, 'ALREADY_MEMBER');
    }

    // Add member
    const member = await prisma.projectMember.create({
      data: {
        projectId,
        userId: user.id,
        role
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatar: true }
        }
      }
    });

    return sendSuccess(res, member, 'Member added successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const removeMember = async (req, res, next) => {
  try {
    const { projectId, memberId } = req.params;

    // Check if user has permission to remove members
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        members: {
          some: {
            userId: req.user.id,
            role: { in: ['creator', 'admin'] }
          }
        }
      }
    });

    if (!project) {
      return sendError(res, 'Project not found or insufficient permissions', 404, 'NOT_FOUND');
    }

    // Check if trying to remove creator
    const memberToRemove = await prisma.projectMember.findFirst({
      where: {
        id: memberId,
        projectId,
        role: 'creator'
      }
    });

    if (memberToRemove) {
      return sendError(res, 'Cannot remove project creator', 400, 'CANNOT_REMOVE_CREATOR');
    }

    // Remove member
    await prisma.projectMember.delete({
      where: { id: memberId }
    });

    return sendSuccess(res, null, 'Member removed successfully');
  } catch (error) {
    next(error);
  }
};
