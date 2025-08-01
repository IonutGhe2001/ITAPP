import express from 'express';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { beforeAll, describe, it, expect } from '@jest/globals';
import { emitUpdate } from '../src/lib/websocket';
import updatesRoutes from '../src/routes/updates';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/updates', updatesRoutes);

const userPayload = {
  id: 1,
  email: 'admin@test.com',
  role: 'admin',
  nume: 'a',
  prenume: 'b',
  functie: 'c',
};

let token: string;

beforeAll(() => {
  process.env.JWT_SECRET = 'test_secret';
  token = jwt.sign(userPayload, 'test_secret');
});

describe('Updates Routes', () => {
  it('filters updates by importance', async () => {
    emitUpdate({ type: 'Coleg', message: 'Important', importance: 'high' });
    emitUpdate({ type: 'Coleg', message: 'Normal' });

    const res = await request(app)
      .get('/api/updates?importance=high')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].message).toBe('Important');
  });
});