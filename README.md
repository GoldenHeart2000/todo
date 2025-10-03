# Collaborative TODO (Kanban) App

A full-stack collaborative TODO application with Google OAuth authentication, real-time Kanban board, and project-level collaboration features.

## Features

- 🔐 **Google OAuth Authentication** - Secure login with Google accounts
- 📋 **Kanban Board** - Drag-and-drop task management with customizable columns
- 👥 **Project Collaboration** - Invite team members and assign tasks
- 🎯 **Role-based Access** - Creator, Admin, and Member roles with different permissions
- 📱 **Responsive Design** - Modern UI built with React and TailwindCSS
- 🗄️ **Persistent Storage** - PostgreSQL database with Prisma ORM
- 🍪 **Secure Authentication** - JWT tokens stored in httpOnly cookies

## Tech Stack

### Backend

- **Node.js** with Express (ESM)
- **PostgreSQL** database
- **Prisma** ORM
- **Passport.js** for Google OAuth
- **JWT** for authentication
- **Cookie-parser** for secure cookie handling

### Frontend

- **React 18** with Vite
- **TailwindCSS** for styling
- **Zustand** for state management
- **@dnd-kit** for drag-and-drop functionality
- **React Router** for navigation
- **Axios** for API calls

## Prerequisites

- Node.js 18+
- PostgreSQL database
- Google OAuth credentials

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Database Setup

1. Create a PostgreSQL database
2. Update the `DATABASE_URL` in your environment variables
3. Run Prisma migrations and seed:

```bash
cd server
npm run prisma:generate
npm run prisma:migrate
npm run seed
```

### 3. Environment Variables

Create a `.env` file in the `server` directory:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:4000/auth/google/callback
JWT_SECRET=verysecretkey
COOKIE_NAME=todo_token
NODE_ENV=development
PORT=4000
FRONTEND_URL=http://localhost:5173
```

### 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:4000/auth/google/callback`
6. Copy Client ID and Client Secret to your `.env` file

### 5. Run the Application

```bash
# Start backend (from server directory)
npm run dev

# Start frontend (from client directory)
npm run dev
```

The application will be available at:

- Frontend: http://localhost:5173
- Backend: http://localhost:4000

## API Documentation

### Authentication Endpoints

- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - Google OAuth callback
- `POST /auth/logout` - Logout user
- `GET /api/me` - Get current user

### Project Endpoints

- `GET /api/projects` - Get user's projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `POST /api/projects/:id/members` - Add member to project
- `DELETE /api/projects/:id/members/:memberId` - Remove member

### Task Endpoints

- `GET /api/tasks/:projectId` - Get project tasks
- `POST /api/tasks/:projectId` - Create new task
- `PUT /api/tasks/:projectId/:taskId` - Update task
- `PUT /api/tasks/:projectId/reorder` - Reorder tasks
- `DELETE /api/tasks/:projectId/:taskId` - Delete task

## Database Schema

### User

- `id` - Unique identifier
- `email` - User email (unique)
- `name` - Display name
- `avatar` - Profile picture URL
- `createdAt` - Account creation date

### Project

- `id` - Unique identifier
- `name` - Project name
- `description` - Project description
- `createdById` - Creator user ID
- `createdAt` - Project creation date

### ProjectMember

- `id` - Unique identifier
- `projectId` - Project ID
- `userId` - User ID
- `role` - Member role (creator/admin/member)
- `addedAt` - When member was added

### Task

- `id` - Unique identifier
- `title` - Task title
- `description` - Task description
- `projectId` - Project ID
- `status` - Task status (todo/in-progress/done)
- `order` - Order within column
- `assigneeId` - Assigned user ID
- `createdById` - Task creator ID
- `dueDate` - Task due date
- `createdAt` - Task creation date
- `updatedAt` - Last update date

## Usage

### Getting Started

1. **Sign In**: Click "Sign in with Google" to authenticate
2. **Create Project**: Click "Create Project" to start a new project
3. **Invite Members**: Add team members by email in project settings
4. **Create Tasks**: Add tasks to your Kanban board
5. **Drag & Drop**: Move tasks between columns (Todo, In Progress, Done)
6. **Assign Tasks**: Assign tasks to team members
7. **Collaborate**: Team members can see and update tasks in real-time

### Project Roles

- **Creator**: Full project control, can add/remove members, delete project
- **Admin**: Can add/remove members, manage tasks
- **Member**: Can view and update tasks, cannot manage members

## Development

### Backend Development

```bash
cd server
npm run dev  # Start with nodemon
npm run prisma:migrate  # Run migrations
npm run prisma:generate  # Generate Prisma client
npm run seed  # Seed database
```

### Frontend Development

```bash
cd client
npm run dev  # Start Vite dev server
npm run build  # Build for production
npm run preview  # Preview production build
```

### Testing

```bash
cd server
npm test  # Run backend tests
```

## Deployment

### Backend Deployment

1. Set up PostgreSQL database
2. Configure environment variables
3. Run migrations: `npm run prisma:migrate`
4. Start application: `npm start`

### Frontend Deployment

1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Update `FRONTEND_URL` in backend environment variables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please create an issue in the GitHub repository.
