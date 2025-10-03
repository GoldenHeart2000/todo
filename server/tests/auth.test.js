import request from 'supertest';
import app from '../src/app.js';

describe('Authentication Endpoints', () => {
  describe('GET /api/me', () => {
    it('should return 401 when no token provided', async () => {
      const response = await request(app)
        .get('/api/me')
        .expect(401);

      expect(response.body.error).toBe(true);
      expect(response.body.code).toBe('NO_TOKEN');
    });

    it('should return 401 when invalid token provided', async () => {
      const response = await request(app)
        .get('/api/me')
        .set('Cookie', 'todo_token=invalid_token')
        .expect(401);

      expect(response.body.error).toBe(true);
      expect(response.body.code).toBe('INVALID_TOKEN');
    });
  });

  describe('POST /auth/logout', () => {
    it('should return success on logout', async () => {
      const response = await request(app)
        .post('/auth/logout')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Logged out successfully');
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('OK');
      expect(response.body.timestamp).toBeDefined();
    });
  });
});
