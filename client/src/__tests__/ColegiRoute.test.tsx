import { render, screen } from '@testing-library/react';
import AppRouter from '@/router';
import { ROUTES } from '@/constants/routes';
import { describe, it, expect, vi } from 'vitest';
import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom'; // used in mock

// Mock authentication to allow accessing protected routes
vi.mock('@/context/useAuth', () => ({
  useAuth: () => ({ isAuthenticated: true, loading: false }),
}));

// Mock Colegi page to simple placeholder
vi.mock('../features/employees/pages/Colegi/Colegi', () => ({
  default: () => <div>Colegi Page</div>,
}));

// Mock AppLayout to avoid needing UserProvider
vi.mock('../layouts/AppLayout', () => ({
  default: () => <Outlet />,
}));

// Replace BrowserRouter with MemoryRouter to control initial route
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    BrowserRouter: ({ children }: { children: ReactNode }) => (
      <actual.MemoryRouter initialEntries={[ROUTES.COLEGI]}>
        {children}
      </actual.MemoryRouter>
    ),
  };
});

describe('Colegi route', () => {
  it('renders the Colegi page and not the NotFound page', async () => {
    render(<AppRouter />);
    await screen.findByText('Colegi Page');
    expect(screen.getByText('Colegi Page')).toBeInTheDocument();
    expect(screen.queryByText('404 - Pagina nu a fost găsită')).not.toBeInTheDocument();
  });
});