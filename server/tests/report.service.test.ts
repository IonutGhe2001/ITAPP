import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { getOnboardingReport } from '../src/services/report.service';

type Task = { completed?: boolean };
type OnboardingRecord = {
  id: string;
  department: string;
  createdAt: Date;
  tasks: Task[];
};

const onboardingRecords: OnboardingRecord[] = [
  {
    id: 'o1',
    department: 'Engineering',
    createdAt: new Date('2024-01-05T00:00:00.000Z'),
    tasks: [
      { completed: true },
      { completed: true },
    ],
  },
  {
    id: 'o2',
    department: 'Engineering',
    createdAt: new Date('2024-01-10T00:00:00.000Z'),
    tasks: [
      { completed: true },
      { completed: false },
    ],
  },
  {
    id: 'o3',
    department: 'HR',
    createdAt: new Date('2024-02-01T00:00:00.000Z'),
    tasks: [],
  },
  {
    id: 'o4',
    department: 'HR',
    createdAt: new Date('2024-02-05T00:00:00.000Z'),
    tasks: [{ completed: true }],
  },
];

type Filters = {
  department?: string;
  startDate?: Date;
  endDate?: Date;
};

const computeCounts = (filters: Filters) => {
  const filtered = onboardingRecords.filter((record) => {
    if (filters.department && record.department !== filters.department) {
      return false;
    }
    if (filters.startDate && record.createdAt < filters.startDate) {
      return false;
    }
    if (filters.endDate && record.createdAt > filters.endDate) {
      return false;
    }
    return true;
  });

  const counts: Record<string, number> = {};
  filtered.forEach((record) => {
    const tasks = Array.isArray(record.tasks) ? record.tasks : [];
    const completed =
      tasks.length > 0 && tasks.every((task) => task.completed === true);
    const status = completed ? 'completed' : 'in_progress';
    counts[status] = (counts[status] ?? 0) + 1;
  });

  return Object.entries(counts).map(([status, count]) => ({ status, count }));
};

const extractFilters = (query: any): Filters => {
  const filters: Filters = {};
  if (!query || !Array.isArray(query.strings)) {
    return filters;
  }

  const values: unknown[] = Array.isArray(query.values) ? query.values : [];

  query.strings.forEach((segment: string, index: number) => {
    if (index >= values.length) {
      return;
    }
    if (segment.includes('"department" = ')) {
      filters.department = values[index] as string;
    } else if (segment.includes('"createdAt" >= ')) {
      filters.startDate = values[index] as Date;
    } else if (segment.includes('"createdAt" <= ')) {
      filters.endDate = values[index] as Date;
    }
  });

  return filters;
};

const mockQueryRaw = jest.fn<
  (query: any) => Promise<Array<{ status: string; count: number }>>
>();

jest.mock('../src/lib/prisma', () => ({
  prisma: {
    $queryRaw: (...args: any[]) => mockQueryRaw(...args),
  },
}));

const sortByStatus = (data: Array<{ status: string; count: number }>) =>
  [...data].sort((a, b) => a.status.localeCompare(b.status));

beforeEach(() => {
  mockQueryRaw.mockReset();
  mockQueryRaw.mockImplementation(async (query: any) => {
    const filters = extractFilters(query);
    return computeCounts(filters);
  });
});

describe('getOnboardingReport', () => {
  it('aggregates onboarding statuses using the JSON query', async () => {
    const result = await getOnboardingReport({ department: 'Engineering' });
    const expected = computeCounts({ department: 'Engineering' });

    expect(sortByStatus(result)).toEqual(sortByStatus(expected));
    expect(mockQueryRaw).toHaveBeenCalledTimes(1);

    const query = mockQueryRaw.mock.calls[0][0];
    expect(Array.isArray(query.strings)).toBe(true);
    expect(query.strings.join(' ')).toContain('jsonb_array_elements');
  });

  it('filters completed onboarding counts', async () => {
    const result = await getOnboardingReport({ status: 'completed' });
    const expected = computeCounts({}).filter(
      (entry) => entry.status === 'completed',
    );

    expect(result).toEqual(expected);
  });

  it('filters in-progress onboarding counts within a date range', async () => {
    const result = await getOnboardingReport({
      status: 'in_progress',
      startDate: '2024-02-01',
      endDate: '2024-02-28',
    });

    const expected = computeCounts({
      startDate: new Date('2024-02-01T00:00:00.000Z'),
      endDate: new Date('2024-02-28T00:00:00.000Z'),
    }).filter((entry) => entry.status === 'in_progress');

    expect(result).toEqual(expected);
  });
});