import express from 'express';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { beforeAll, describe, it, expect, jest } from '@jest/globals';

// In-memory storage for seeded equipment
const echipData: any[] = [];

jest.mock('../src/lib/prisma', () => ({
  prisma: {
    echipament: {
      createMany: jest.fn(({ data }: any) => {
        echipData.push(...data);
        return Promise.resolve({ count: data.length });
      }),
      count: jest.fn((args?: any) => {
        if (args?.where?.stare) {
          return Promise.resolve(
            echipData.filter((e) => e.stare === args.where.stare).length,
          );
        }
        return Promise.resolve(echipData.length);
      }),
      groupBy: jest.fn(() => {
        const grouped: any[] = [];
        echipData.forEach((e) => {
          const existing = grouped.find((g) => g.stare === e.stare);
          if (existing) {
            existing._count.stare += 1;
          } else {
            grouped.push({ stare: e.stare, _count: { stare: 1 } });
          }
        });
        return Promise.resolve(grouped);
      }),
    },
    angajat: {
      count: jest
        .fn<(...args: any[]) => Promise<number>>()
        .mockResolvedValue(0),
    },
  },
}));

const { prisma } = require('../src/lib/prisma');
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
  functie: 'c',
};

let token: string;

beforeAll(async () => {
  process.env.JWT_SECRET = 'test_secret';
  token = jwt.sign(userPayload, 'test_secret');

  await prisma.echipament.createMany({
    data: [
      { nume: 'E1', tip: 'Laptop', serie: 'S1', stare: 'in_stoc' },
      { nume: 'E2', tip: 'Laptop', serie: 'S2', stare: 'alocat' },
      { nume: 'E3', tip: 'Laptop', serie: 'S3', stare: 'in_stoc' },
    ],
  });
});

describe('GET /echipamente/stats', () => {
  it('returns accurate status counts', async () => {
    const res = await request(app)
      .get('/api/echipamente/stats')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.in_stoc).toBe(2);
    expect(res.body.alocat).toBe(1);
    expect(res.body.in_comanda).toBe(0);
    expect(res.body.mentenanta).toBe(0);
  });
});