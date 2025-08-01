import express from 'express';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { beforeAll, afterEach, describe, it, expect, jest } from '@jest/globals';

jest.mock('../src/services/report.service', () => ({
  getEquipmentReport: jest.fn(),
  getOnboardingReport: jest.fn(),
}));

const reportService = require('../src/services/report.service');
const reportsRoutes = require('../src/routes/reports').default;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/reports', reportsRoutes);

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

describe('Reports Routes', () => {
  it('returns equipment report json', async () => {
    (reportService.getEquipmentReport as jest.Mock).mockResolvedValue([
      { type: 'allocated', count: 1 },
    ]);
    const res = await request(app)
      .get('/api/reports/equipment')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ type: 'allocated', count: 1 }]);
  });

  it('returns equipment report csv', async () => {
    (reportService.getEquipmentReport as jest.Mock).mockResolvedValue([
      { type: 'allocated', count: 1 },
    ]);
    const res = await request(app)
      .get('/api/reports/equipment?format=csv')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/csv');
  });

  it('returns onboarding report json', async () => {
    (reportService.getOnboardingReport as jest.Mock).mockResolvedValue([
      { status: 'in_progress', count: 1 },
    ]);
    const res = await request(app)
      .get('/api/reports/onboarding')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ status: 'in_progress', count: 1 }]);
  });
});