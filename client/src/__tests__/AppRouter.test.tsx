import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Outlet } from 'react-router-dom';
import AppRouter from '@/router';

vi.mock('@/context/useAuth', () => ({
  useAuth: () => ({ isAuthenticated: true, loading: false }),
}));

vi.mock('@/layouts/AppLayout', () => ({
  default: () => <Outlet />,
}));

vi.mock('@/features/employees/pages/Colegi/Colegi', () => ({
  default: () => <div>Colegi Page</div>,
}));

describe('AppRouter Colegi route', () => {
  it('renders Colegi for /colegi', async () => {
    window.history.pushState({}, '', '/colegi');
    render(<AppRouter />);
    expect(await screen.findByText('Colegi Page')).toBeInTheDocument();
  });

  it('renders Colegi for /colegi/', async () => {
    window.history.pushState({}, '', '/colegi/');
    render(<AppRouter />);
    expect(await screen.findByText('Colegi Page')).toBeInTheDocument();
  });
});