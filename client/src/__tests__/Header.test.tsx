import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../layouts/components/Header';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ROUTES } from '@/constants/routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('@/context/useSearch', () => ({
  useSearch: () => ({ query: '', setQuery: vi.fn() }),
}));

vi.mock('@/context/useUser', () => ({
  useUser: () => ({ user: { nume: 'John', prenume: 'Doe', functie: 'Admin' }, loading: false }),
}));

const notificationsMock: any[] = [];
const markAllRead = vi.fn();
const removeNotification = vi.fn();
const clearRead = vi.fn();

vi.mock('@/context/useNotifications', () => ({
  useNotifications: () => ({
    notifications: notificationsMock,
    markAllRead,
    removeNotification,
    clearRead,
  }),
}));

vi.mock('@/context/useAuth', () => ({
  useAuth: () => ({ isAuthenticated: true }),
}));

vi.mock('@/services/searchService', () => ({
  useSearchSuggestions: () => ({ data: { echipamente: [], angajati: [] } }),
}));

vi.mock('@/features/equipment', () => ({
  useEchipament: (id: string) => ({ data: id ? { nume: 'Laptop Pro' } : undefined }),
}));

describe('Header', () => {
  beforeEach(() => {
    notificationsMock.length = 0;
  });

  it('renders page title based on route', () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[ROUTES.COLEGI]}>
          <Header />
        </MemoryRouter>
      </QueryClientProvider>
    );
    expect(screen.getByText('Colegi')).toBeInTheDocument();
  });

  it('shows indicator for unread important notifications', () => {
    notificationsMock.push({
      id: '1',
      type: 'Coleg',
      message: 'Important',
      timestamp: new Date().toISOString(),
      importance: 'high',
      read: false,
    });
    const queryClient = new QueryClient();
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </QueryClientProvider>
    );
    expect(container.querySelector('.bg-destructive')).toBeInTheDocument();
  });

  it('renders equipment name on detail page', () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[`/echipamente/1`]}>
          <Header />
        </MemoryRouter>
      </QueryClientProvider>
    );
    expect(screen.getByText('INFO: Laptop Pro')).toBeInTheDocument();
  });
});
