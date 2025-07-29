import express from 'express';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import jwt from 'jsonwebtoken';
jest.mock('../src/services/echipament.service', () => ({
  getEchipamente: jest.fn(),
  createEchipament: jest.fn(),
}));
const echipService = require('../src/services/echipament.service');
// load route after mocking services
const echipRoutes = require('../src/routes/echipamente').default;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/echipamente', echipRoutes);

const userPayload = {
  id: 1,
  email: 'admin@test.com',
  role: 'admin',
  nume: 'a',
  prenume: 'b',
  functie: 'c'
};

let token: string;

beforeAll(() => {
  process.env.JWT_SECRET = 'test_secret';
  token = jwt.sign(userPayload, 'test_secret');
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Echipamente Routes', () => {
  it('get echipamente', async () => {
    (echipService.getEchipamente as jest.Mock).mockResolvedValue([{ id: '1' }]);

    const res = await request(app)
      .get('/api/echipamente')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: '1' }]);
  });

  it('create echipament', async () => {
    (echipService.createEchipament as jest.Mock).mockResolvedValue({ id: '1', nume: 'Lap' });

    const res = await request(app)
      .post('/api/echipamente')
      .set('Authorization', `Bearer ${token}`)
      .send({ nume: 'Lap', tip: 'Laptop', serie: 'S1' });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: '1', nume: 'Lap' });
    expect(echipService.createEchipament).toHaveBeenCalled();
  });
});