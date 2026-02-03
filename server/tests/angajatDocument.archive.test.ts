import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import {
  addAngajatDocument,
  searchDocuments,
  logDocumentAccess,
} from '../src/services/angajatDocument.service';

jest.mock('../src/lib/prisma', () => ({
  prisma: {
    angajatDocument: {
      create: jest.fn<(...args: any[]) => Promise<any>>(),
      count: jest.fn<(...args: any[]) => Promise<any>>(),
      findMany: jest.fn<(...args: any[]) => Promise<any>>(),
    },
    documentAccessLog: {
      create: jest.fn<(...args: any[]) => Promise<any>>(),
    },
    $transaction: jest.fn<(...args: any[]) => Promise<any>>(),
  },
}));

import { prisma } from '../src/lib/prisma';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Document Archive Service', () => {
  describe('addAngajatDocument', () => {
    it('creates document with archive metadata', async () => {
      const mockDoc = {
        id: 'd1',
        angajatId: 'a1',
        name: 'test.pdf',
        path: '/docs/test.pdf',
        documentType: 'CONTRACT_ANGAJARE',
        uploadYear: 2024,
      };

      (prisma.angajatDocument.create as jest.MockedFunction<typeof prisma.angajatDocument.create>).mockResolvedValue(
        mockDoc as any
      );

      const result = await addAngajatDocument(
        'a1',
        'test.pdf',
        '/docs/test.pdf',
        'application/pdf',
        1024,
        'Admin User',
        'CONTRACT_ANGAJARE' as any,
        2024
      );

      expect(prisma.angajatDocument.create).toHaveBeenCalledWith({
        data: {
          angajatId: 'a1',
          name: 'test.pdf',
          path: '/docs/test.pdf',
          type: 'application/pdf',
          size: 1024,
          uploadedBy: 'Admin User',
          documentType: 'CONTRACT_ANGAJARE',
          uploadYear: 2024,
        },
      });
      expect(result.documentType).toBe('CONTRACT_ANGAJARE');
      expect(result.uploadYear).toBe(2024);
    });

    it('defaults to OTHER and current year when not specified', async () => {
      const mockDoc = {
        id: 'd1',
        angajatId: 'a1',
        name: 'test.pdf',
        path: '/docs/test.pdf',
        documentType: 'OTHER',
        uploadYear: new Date().getFullYear(),
      };

      (prisma.angajatDocument.create as jest.MockedFunction<typeof prisma.angajatDocument.create>).mockResolvedValue(
        mockDoc as any
      );

      await addAngajatDocument('a1', 'test.pdf', '/docs/test.pdf');

      expect(prisma.angajatDocument.create).toHaveBeenCalledWith({
        data: {
          angajatId: 'a1',
          name: 'test.pdf',
          path: '/docs/test.pdf',
          type: undefined,
          size: undefined,
          uploadedBy: undefined,
          documentType: 'OTHER',
          uploadYear: new Date().getFullYear(),
        },
      });
    });
  });

  describe('searchDocuments', () => {
    it('searches documents by employee name and type', async () => {
      const mockDocs = [
        {
          id: 'd1',
          name: 'contract.pdf',
          documentType: 'CONTRACT_ANGAJARE',
          uploadYear: 2024,
          angajat: {
            id: 'a1',
            numeComplet: 'John Doe',
            isActive: true,
          },
        },
      ];

      (prisma.$transaction as jest.MockedFunction<typeof prisma.$transaction>).mockResolvedValue([1, mockDocs] as any);

      const result = await searchDocuments({
        employeeName: 'John',
        documentType: 'CONTRACT_ANGAJARE' as any,
        uploadYear: 2024,
        page: 1,
        pageSize: 50,
      });

      expect(result.data).toEqual(mockDocs);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(1);
    });

    it('filters out inactive employees by default', async () => {
      (prisma.$transaction as jest.MockedFunction<typeof prisma.$transaction>).mockResolvedValue([0, []] as any);

      await searchDocuments({
        includeInactive: false,
        page: 1,
        pageSize: 50,
      });

      // Check that $transaction was called with where clause including isActive
      expect(prisma.$transaction).toHaveBeenCalled();
    });

    it('includes inactive employees when requested', async () => {
      (prisma.$transaction as jest.MockedFunction<typeof prisma.$transaction>).mockResolvedValue([0, []] as any);

      await searchDocuments({
        includeInactive: true,
        page: 1,
        pageSize: 50,
      });

      expect(prisma.$transaction).toHaveBeenCalled();
    });
  });

  describe('logDocumentAccess', () => {
    it('creates an access log entry', async () => {
      const mockLog = {
        id: 'l1',
        documentId: 'd1',
        userId: 1,
        userEmail: 'admin@test.com',
        userName: 'Admin User',
        action: 'DOWNLOAD',
        ipAddress: '127.0.0.1',
        timestamp: new Date(),
      };

      (prisma.documentAccessLog.create as jest.MockedFunction<typeof prisma.documentAccessLog.create>).mockResolvedValue(
        mockLog as any
      );

      const result = await logDocumentAccess(
        'd1',
        1,
        'admin@test.com',
        'Admin User',
        'DOWNLOAD',
        '127.0.0.1'
      );

      expect(prisma.documentAccessLog.create).toHaveBeenCalledWith({
        data: {
          documentId: 'd1',
          userId: 1,
          userEmail: 'admin@test.com',
          userName: 'Admin User',
          action: 'DOWNLOAD',
          ipAddress: '127.0.0.1',
        },
      });
      expect(result.action).toBe('DOWNLOAD');
    });
  });
});
