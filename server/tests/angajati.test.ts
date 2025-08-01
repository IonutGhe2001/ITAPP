import express from 'express';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { beforeAll, afterEach, describe, it, expect, jest } from '@jest/globals';

jest.mock('../src/services/angajat.service', () => ({
  getAngajati: jest.fn(),
  getAngajatById: jest.fn(),
  createAngajat: jest.fn(),
  updateAngajat: jest.fn(),
  deleteAngajat: jest.fn(),
  createEmailAccount: jest.fn(),
}));
jest.mock('../src/lib/websocket', () => ({ emitUpdate: jest.fn() }));
const angajatService = require('../src/services/angajat.service');
const { emitUpdate } = require('../src/lib/websocket');
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
  it('create angajat', async () => {
    (angajatService.createAngajat as jest.MockedFunction<typeof angajatService.createAngajat>).mockResolvedValue({ id: '1', numeComplet: 'Ion Pop', functie: 'Dev' });

    const res = await request(app)
      .post('/api/angajati')
      .set('Authorization', `Bearer ${token}`)
      .send({ numeComplet: 'Ion Pop', functie: 'Dev' });

    expect(res.status).toBe(201);
    expect(angajatService.createAngajat).toHaveBeenCalled();
    expect(emitUpdate).toHaveBeenCalledWith({
      type: 'Coleg',
      message: 'Coleg nou: Ion Pop',
      importance: 'high',
    });
  });

  it('update angajat', async () => {
    (angajatService.updateAngajat as jest.MockedFunction<typeof angajatService.updateAngajat>).mockResolvedValue({ id: '1' });

    const res = await request(app)
      .put('/api/angajati/1')
      .set('Authorization', `Bearer ${token}`)
      .send({ functie: 'Manager' });

    expect(res.status).toBe(200);
    expect(angajatService.updateAngajat).toHaveBeenCalled();
    expect(emitUpdate).toHaveBeenCalledWith({
      type: 'Coleg',
      message: 'Coleg actualizat',
      importance: 'normal',
    });
  });

  it('delete angajat', async () => {
    (angajatService.deleteAngajat as jest.MockedFunction<typeof angajatService.deleteAngajat>).mockResolvedValue(null);

    const res = await request(app)
      .delete('/api/angajati/123')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(angajatService.deleteAngajat).toHaveBeenCalledWith('123');
    expect(emitUpdate).toHaveBeenCalledWith({
      type: 'Coleg',
      message: 'Coleg șters',
      importance: 'high',
    });
  });

   it('create email account', async () => {
    (angajatService.createEmailAccount as jest.MockedFunction<typeof angajatService.createEmailAccount>).mockResolvedValue({ id: '1', email: 'test@test.com' });

    const res = await request(app)
      .post('/api/angajati/1/email-account')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'test@test.com', responsible: 'Admin', link: 'http://mail.test' });

    expect(res.status).toBe(200);
    expect(angajatService.createEmailAccount).toHaveBeenCalledWith('1', {
      email: 'test@test.com',
      responsible: 'Admin',
      link: 'http://mail.test',
    });
    expect(emitUpdate).toHaveBeenCalledWith({
      type: 'Coleg',
      message: 'Cont e-mail marcat ca creat',
      importance: 'normal',
    });
  });
});