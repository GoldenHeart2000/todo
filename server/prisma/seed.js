import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create demo user
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
      avatar: 'https://via.placeholder.com/150',
    },
  });

  // Create demo project
  const demoProject = await prisma.project.create({
    data: {
      name: 'Demo Project',
      description: 'A sample project to get started',
      createdById: demoUser.id,
    },
  });

  // Add user as project member
  await prisma.projectMember.create({
    data: {
      projectId: demoProject.id,
      userId: demoUser.id,
      role: 'creator',
    },
  });

  // Create demo tasks
  const tasks = [
    {
      title: 'Welcome to your Kanban board!',
      description: 'This is your first task. You can drag it between columns.',
      status: 'todo',
      order: 0,
      projectId: demoProject.id,
      createdById: demoUser.id,
    },
    {
      title: 'Set up your team',
      description: 'Invite team members to collaborate on this project.',
      status: 'todo',
      order: 1,
      projectId: demoProject.id,
      createdById: demoUser.id,
    },
    {
      title: 'Plan your first sprint',
      description: 'Organize tasks and set priorities for your project.',
      status: 'in-progress',
      order: 0,
      projectId: demoProject.id,
      createdById: demoUser.id,
    },
    {
      title: 'Review completed work',
      description: 'Tasks that are done will appear in this column.',
      status: 'done',
      order: 0,
      projectId: demoProject.id,
      createdById: demoUser.id,
    },
  ];

  for (const task of tasks) {
    await prisma.task.create({
      data: task,
    });
  }

  console.log('Seed data created successfully!');
  console.log('Demo user:', demoUser.email);
  console.log('Demo project:', demoProject.name);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
