import express from 'express';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { beforeAll, afterEach, describe, it, expect, jest } from '@jest/globals';
jest.mock('../src/services/echipament.service', () => ({
  getEchipament: jest.fn(),
  getEchipamente: jest.fn(),
  createEchipament: jest.fn(),
  updateEchipament: jest.fn(),
  deleteEchipament: jest.fn(),
}));
jest.mock('../src/lib/websocket', () => ({ emitUpdate: jest.fn() }));
const echipService = require('../src/services/echipament.service');
const { emitUpdate } = require('../src/lib/websocket');
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
    (echipService.getEchipamente as jest.MockedFunction<typeof echipService.getEchipamente>).mockResolvedValue([{ id: '1' }]);

    const res = await request(app)
      .get('/api/echipamente')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: '1' }]);
  });

  it('create echipament', async () => {
    (echipService.createEchipament as jest.MockedFunction<typeof echipService.createEchipament>).mockResolvedValue({ id: '1', nume: 'Lap' });

    const res = await request(app)
      .post('/api/echipamente')
      .set('Authorization', `Bearer ${token}`)
      .send({ nume: 'Lap', tip: 'Laptop', serie: 'S1' });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: '1', nume: 'Lap' });
    expect(echipService.createEchipament).toHaveBeenCalled();
    expect(emitUpdate).toHaveBeenCalledWith({
      type: 'Echipament',
      message: 'Echipament adăugat: Lap',
      importance: 'high',
    });
  });
 it('update echipament', async () => {
    (echipService.updateEchipament as jest.MockedFunction<typeof echipService.updateEchipament>).mockResolvedValue({ id: '1', nume: 'Lap2' });

    const res = await request(app)
      .put('/api/echipamente/1')
      .set('Authorization', `Bearer ${token}`)
      .send({ nume: 'Lap2' });

    expect(res.status).toBe(200);
    expect(echipService.updateEchipament).toHaveBeenCalled();
    expect(emitUpdate).toHaveBeenCalledWith({
      type: 'Echipament',
      message: 'Echipament actualizat',
      importance: 'normal',
    });
  });

  it('delete echipament', async () => {
    (echipService.deleteEchipament as jest.MockedFunction<typeof echipService.deleteEchipament>).mockResolvedValue(null);

    const res = await request(app)
      .delete('/api/echipamente/1')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(echipService.deleteEchipament).toHaveBeenCalledWith('1');
    expect(emitUpdate).toHaveBeenCalledWith({
      type: 'Echipament',
      message: 'Echipament șters',
      importance: 'high',
    });
  });
});