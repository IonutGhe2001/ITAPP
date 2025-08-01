import express from 'express';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { beforeAll, afterEach, describe, it, expect, jest } from '@jest/globals';

jest.mock('../src/services/departmentConfig.service', () => ({
  getConfigs: jest.fn(),
  createConfig: jest.fn(),
  updateConfig: jest.fn(),
}));

const configService = require('../src/services/departmentConfig.service');
const configRoutes = require('../src/routes/departmentConfig').default;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/department-configs', configRoutes);

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

describe('DepartmentConfig Routes', () => {
  it('create config', async () => {
    (configService.createConfig as jest.MockedFunction<typeof configService.createConfig>).mockResolvedValue({ id: '1', name: 'IT' });

    const res = await request(app)
      .post('/api/department-configs')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'IT' });

    expect(res.status).toBe(201);
    expect(configService.createConfig).toHaveBeenCalled();
  });

  it('update config', async () => {
    (configService.updateConfig as jest.MockedFunction<typeof configService.updateConfig>).mockResolvedValue({ id: '1', name: 'HR' });

    const res = await request(app)
      .put('/api/department-configs/1')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'HR' });

    expect(res.status).toBe(200);
    expect(configService.updateConfig).toHaveBeenCalled();
  });
});