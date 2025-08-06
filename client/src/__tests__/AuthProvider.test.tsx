import { render, screen, waitFor, renderHook } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/services/authService', () => ({
  logout: vi.fn(),
}));

vi.mock('@/utils/storage', () => ({
  getToken: vi.fn(() => null),
  setToken: vi.fn(),
  removeToken: vi.fn(),
}));

import { AuthProvider } from '@/context/AuthProvider';
import { useAuth } from '@/context/useAuth';
import { logout as logoutRequest } from '@/services/authService';
import { setToken, removeToken } from '@/utils/storage';

const logoutMock = vi.mocked(logoutRequest);
const setTokenMock = vi.mocked(setToken);
const removeTokenMock = vi.mocked(removeToken);

function TestComponent() {
  const { login, logout, isAuthenticated } = useAuth();
  return (
    <div>
      <span>{isAuthenticated ? 'logged-in' : 'logged-out'}</span>
      <button onClick={() => login('token123')}>login</button>
      <button onClick={logout}>logout</button>
    </div>
  );
}

describe('AuthProvider', () => {
  beforeEach(() => {
    setTokenMock.mockReset();
    removeTokenMock.mockReset();
    logoutMock.mockReset();
    global.fetch = vi.fn(() => Promise.resolve({ ok: false })) as any;
  });

  it('logs in and stores token', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    const user = userEvent.setup();
    await user.click(screen.getByText('login'));
    expect(setTokenMock).toHaveBeenCalledWith('token123');
    expect(screen.getByText('logged-in')).toBeInTheDocument();
  });

  it('removes token on logout even if request fails', async () => {
    logoutMock.mockRejectedValueOnce(new Error('fail'));
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    const user = userEvent.setup();
    await user.click(screen.getByText('login'));
    await user.click(screen.getByText('logout'));
    await waitFor(() => {
      expect(removeTokenMock).toHaveBeenCalled();
      expect(screen.getByText('logged-out')).toBeInTheDocument();
    });
  });

  it('throws if useAuth is used outside provider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useAuth())).toThrow(
      'useAuth must be used within AuthProvider',
    );
    consoleError.mockRestore();
  });
});