import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../layouts/components/Header';
import { vi } from 'vitest';
import { ROUTES } from '@/constants/routes';

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

describe('Header', () => {
  beforeEach(() => {
    notificationsMock.length = 0;
  });

  it('renders page title based on route', () => {
    render(
      <MemoryRouter initialEntries={[ROUTES.COLEGI]}>
        <Header />
      </MemoryRouter>
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
    const { container } = render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    expect(container.querySelector('.bg-destructive')).toBeInTheDocument();
  });
});
