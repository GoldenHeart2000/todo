import { sendSuccess, sendError } from '../utils/sendResponse.js';
import prisma from '../../prismaClient.js';

export const getTasks = async (req, res, next) => {
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

    const tasks = await prisma.task.findMany({
      where: { projectId },
      include: {
        assignee: {
          select: { id: true, name: true, email: true, avatar: true }
        },
        createdBy: {
          select: { id: true, name: true, email: true, avatar: true }
        }
      },
      orderBy: { order: 'asc' }
    });

    return sendSuccess(res, tasks, 'Tasks retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { title, description, status = 'todo', assigneeId, dueDate } = req.body;

    if (!title) {
      return sendError(res, 'Task title is required', 400, 'VALIDATION_ERROR');
    }

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

    // Get the highest order number for the status
    const lastTask = await prisma.task.findFirst({
      where: { projectId, status },
      orderBy: { order: 'desc' }
    });

    const order = lastTask ? lastTask.order + 1 : 0;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        order,
        projectId,
        createdById: req.user.id,
        assigneeId: assigneeId || null,
        dueDate: dueDate ? new Date(dueDate) : null
      },
      include: {
        assignee: {
          select: { id: true, name: true, email: true, avatar: true }
        },
        createdBy: {
          select: { id: true, name: true, email: true, avatar: true }
        }
      }
    });

    return sendSuccess(res, task, 'Task created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { projectId, taskId } = req.params;
    const { title, description, status, assigneeId, dueDate } = req.body;

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

    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        projectId
      }
    });

    if (!task) {
      return sendError(res, 'Task not found', 404, 'NOT_FOUND');
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
        ...(assigneeId !== undefined && { assigneeId: assigneeId || null }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null })
      },
      include: {
        assignee: {
          select: { id: true, name: true, email: true, avatar: true }
        },
        createdBy: {
          select: { id: true, name: true, email: true, avatar: true }
        }
      }
    });

    return sendSuccess(res, updatedTask, 'Task updated successfully');
  } catch (error) {
    next(error);
  }
};

export const reorderTasks = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { tasks } = req.body;
    if (!Array.isArray(tasks)) {
      return sendError(res, 'Tasks must be an array', 400, 'VALIDATION_ERROR');
    }

    // Check access
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        members: { some: { userId: req.user.id } },
      },
    });
    console.log(project)
    if (!project) {
      return sendError(res, 'Project not found', 404, 'NOT_FOUND');
    }

    // Normalize payload and filter invalid entries
    const normalized = tasks
      .filter(t => t && typeof t.id === 'string')
      .map(t => ({ id: t.id, status: String(t.status || ''), order: Number.isFinite(t.order) ? t.order : 0 }));

    if (normalized.length === 0) {
      return sendSuccess(res, null, 'Nothing to reorder');
    }

    // Only update tasks that belong to this project
    const existing = await prisma.task.findMany({
      where: {
        projectId,
        id: { in: normalized.map(t => t.id) },
      },
      select: { id: true },
    });

    const existingIds = new Set(existing.map(t => t.id));
    const updates = normalized.filter(t => existingIds.has(t.id));

    if (updates.length === 0) {
      // Gracefully return instead of throwing Task not found
      return sendSuccess(res, null, 'No matching tasks to update');
    }

    await prisma.$transaction(
      updates.map((t) =>
        prisma.task.update({
          where: { id: t.id },
          data: { status: t.status, order: t.order },
        })
      )
    );

    return sendSuccess(res, null, 'Tasks reordered successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { projectId, taskId } = req.params;

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

    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        projectId
      }
    });

    if (!task) {
      return sendError(res, 'Task not found', 404, 'NOT_FOUND');
    }

    // Check if user can delete task (creator/admin or task creator)
    const userMembership = await prisma.projectMember.findFirst({
      where: {
        projectId,
        userId: req.user.id
      }
    });

    const canDelete = userMembership?.role === 'creator' || 
                     userMembership?.role === 'admin' || 
                     task.createdById === req.user.id;

    if (!canDelete) {
      return sendError(res, 'Insufficient permissions to delete task', 403, 'FORBIDDEN');
    }

    await prisma.task.delete({
      where: { id: taskId }
    });

    return sendSuccess(res, null, 'Task deleted successfully');
  } catch (error) {
    next(error);
  }
};
