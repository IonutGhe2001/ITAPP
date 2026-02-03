import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import {
  archiveAngajat,
  unarchiveAngajat,
} from '../src/services/angajat.service';

jest.mock('../src/lib/prisma', () => ({
  prisma: {
    angajat: {
      update: jest.fn<(...args: any[]) => Promise<any>>(),
    },
  },
}));

import { prisma } from '../src/lib/prisma';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Archive/Unarchive Angajat', () => {
  describe('archiveAngajat', () => {
    it('marks employee as inactive and sets archive metadata', async () => {
      const mockEmployee = {
        id: 'a1',
        numeComplet: 'Test Employee',
        isActive: false,
        archivedAt: new Date(),
        archivedBy: 'Admin User',
      };

      (prisma.angajat.update as jest.MockedFunction<typeof prisma.angajat.update>).mockResolvedValue(
        mockEmployee as any
      );

      const result = await archiveAngajat('a1', 'Admin User');

      expect(prisma.angajat.update).toHaveBeenCalledWith({
        where: { id: 'a1' },
        data: {
          isActive: false,
          archivedAt: expect.any(Date),
          archivedBy: 'Admin User',
        },
      });
      expect(result.isActive).toBe(false);
      expect(result.archivedBy).toBe('Admin User');
    });
  });

  describe('unarchiveAngajat', () => {
    it('marks employee as active and clears archive metadata', async () => {
      const mockEmployee = {
        id: 'a1',
        numeComplet: 'Test Employee',
        isActive: true,
        archivedAt: null,
        archivedBy: null,
      };

      (prisma.angajat.update as jest.MockedFunction<typeof prisma.angajat.update>).mockResolvedValue(
        mockEmployee as any
      );

      const result = await unarchiveAngajat('a1');

      expect(prisma.angajat.update).toHaveBeenCalledWith({
        where: { id: 'a1' },
        data: {
          isActive: true,
          archivedAt: null,
          archivedBy: null,
        },
      });
      expect(result.isActive).toBe(true);
      expect(result.archivedAt).toBeNull();
      expect(result.archivedBy).toBeNull();
    });
  });
});
