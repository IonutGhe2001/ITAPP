import express from 'express';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { beforeAll, afterEach, describe, it, expect, jest } from '@jest/globals';

jest.mock('../src/services/angajat.service', () => ({
  deleteAngajat: jest.fn(),
}));
const angajatService = require('../src/services/angajat.service');
const angajatRoutes = require('../src/routes/angajati').default;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/angajati', angajatRoutes);

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

describe('Angajati Routes', () => {
  it('delete angajat', async () => {
    (angajatService.deleteAngajat as jest.MockedFunction<typeof angajatService.deleteAngajat>).mockResolvedValue(null);

    const res = await request(app)
      .delete('/api/angajati/123')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(angajatService.deleteAngajat).toHaveBeenCalledWith('123');
  });
});