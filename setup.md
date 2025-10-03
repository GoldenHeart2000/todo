# Quick Setup Guide

## Prerequisites

- Node.js 18+
- PostgreSQL database
- Google OAuth credentials

## 1. Install Dependencies

```bash
# Install all dependencies
npm run install:all
```

## 2. Database Setup

1. Create a PostgreSQL database
2. Copy `.env.example` to `.env` in the server directory
3. Update the `DATABASE_URL` with your database credentials
4. Run database setup:

```bash
npm run setup:db
```

## 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add redirect URI: `http://localhost:4000/auth/google/callback`
6. Update `.env` with your Google credentials

## 4. Start Development

```bash
# Start both frontend and backend
npm run dev
```

## 5. Access the Application

- Frontend: http://localhost:5173
- Backend: http://localhost:4000
- Health Check: http://localhost:4000/health

## Environment Variables

Create `server/.env` with:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/todo_app"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
GOOGLE_CALLBACK_URL="http://localhost:4000/auth/google/callback"
JWT_SECRET="your_super_secret_jwt_key"
COOKIE_NAME="todo_token"
NODE_ENV="development"
PORT=4000
FRONTEND_URL="http://localhost:5173"
```

## Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify database exists

### Google OAuth Issues

- Check redirect URI matches exactly
- Ensure Google+ API is enabled
- Verify client ID and secret are correct

### Port Conflicts

- Backend runs on port 4000
- Frontend runs on port 5173
- Change ports in respective package.json files if needed
