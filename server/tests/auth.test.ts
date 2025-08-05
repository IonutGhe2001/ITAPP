import express from 'express';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { beforeAll, afterEach, describe, it, expect, jest } from '@jest/globals';
jest.mock('../src/services/auth.service', () => ({
  authenticateUser: jest.fn(),
}));
const authService = require('../src/services/auth.service');
// import route after mocking services to avoid loading real modules
const authRoutes = require('../src/routes/auth').default;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);

beforeAll(() => {
  process.env.JWT_SECRET = 'test_secret';
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Auth Routes', () => {
  it('login success', async () => {
    (authService.authenticateUser as jest.MockedFunction<typeof authService.authenticateUser>).mockResolvedValue('token123');

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'pass' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, token: 'token123' });
    expect(res.headers['set-cookie']).toBeDefined();
    expect(authService.authenticateUser).toHaveBeenCalledWith('test@example.com', 'pass');
  });

  it('login failure', async () => {
    (authService.authenticateUser as jest.MockedFunction<typeof authService.authenticateUser>).mockResolvedValue(null);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'wrong@example.com', password: 'bad' });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: 'Date de autentificare invalide' });
  });

  it('login validation failure returns generic message', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'invalid', password: 'pass' });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: 'Date de autentificare invalide' });
    expect(authService.authenticateUser).not.toHaveBeenCalled();
  });
});