import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Container from '../components/Container';
import { Outlet } from 'react-router-dom';
import { UserProvider } from '@/store/UserContext';
import { SearchProvider } from '@/context/SearchContext';

export default function AppLayout() {
  return (
    <UserProvider>
      <SearchProvider>
        <div className="flex min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-100">
          <Sidebar />
          <div className="flex flex-1 flex-col md:ml-60">
            <Header />
            <main className="flex-1 overflow-y-auto">
              <Container className="py-4">
                <Outlet />
              </Container>
            </main>
          </div>
        </div>
      </SearchProvider>
    </UserProvider>
  );
}
