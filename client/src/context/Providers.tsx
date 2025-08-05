import type { ReactNode } from 'react';

import { AuthProvider } from './AuthProvider';
import { UserProvider } from './UserProvider';
import { SearchProvider } from './SearchProvider';
import { NotificationsProvider } from './NotificationsProvider';
import { ToastProvider } from '@components/ToastProvider';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <UserProvider>
        <SearchProvider>
          <ToastProvider>
            <NotificationsProvider>{children}</NotificationsProvider>
          </ToastProvider>
        </SearchProvider>
      </UserProvider>
    </AuthProvider>
  );
}
