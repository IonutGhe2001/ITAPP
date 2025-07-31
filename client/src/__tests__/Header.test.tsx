import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../layouts/components/Header';
import { vi } from 'vitest';

vi.mock('@/context/use-search', () => ({
  useSearch: () => ({ query: '', setQuery: vi.fn() }),
}));

vi.mock('@/store/use-user', () => ({
  useUser: () => ({ user: { nume: 'John', prenume: 'Doe', functie: 'Admin' }, loading: false }),
}));

vi.mock('@/context/use-notifications', () => ({
  useNotifications: () => ({
    notifications: [],
    unreadCount: 0,
    markAllRead: vi.fn(),
    removeNotification: vi.fn(),
    clearRead: vi.fn(),
  }),
}));

vi.mock('@/context/use-auth', () => ({
  useAuth: () => ({ isAuthenticated: true }),
}));

vi.mock('@/services/searchService', () => ({
  useSearchSuggestions: () => ({ data: { echipamente: [], angajati: [] } }),
}));

describe('Header', () => {
  it('renders page title based on route', () => {
    render(
      <MemoryRouter initialEntries={['/colegi']}>
        <Header />
      </MemoryRouter>
    );
    expect(screen.getByText('Colegi')).toBeInTheDocument();
  });
});