import express from 'express';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { beforeAll, afterEach, describe, it, expect, jest } from '@jest/globals';

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({})),
    ProcesVerbalTip: {
      PREDARE_PRIMIRE: 'PREDARE_PRIMIRE',
      RESTITUIRE: 'RESTITUIRE',
      SCHIMB: 'SCHIMB',
    },
  };
});

jest.mock('../src/services/procesVerbal.service', () => ({
  creeazaProcesVerbalCuEchipamente: jest.fn(),
}));
const procesService = require('../src/services/procesVerbal.service');
const proceseVerbaleRoutes = require('../src/routes/proceseVerbale').default;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/procese-verbale', proceseVerbaleRoutes);

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

afterEach(() => {
  jest.clearAllMocks();
});

describe('Procese Verbale Routes', () => {
  it('rejects invalid tip value', async () => {
    const res = await request(app)
      .post('/api/procese-verbale')
      .set('Authorization', `Bearer ${token}`)
      .send({ angajatId: '123e4567-e89b-12d3-a456-426614174000', tip: 'INVALID' });

    expect(res.status).toBe(400);
    expect(procesService.creeazaProcesVerbalCuEchipamente).not.toHaveBeenCalled();
  });
});