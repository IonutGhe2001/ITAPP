import { NavLink, useNavigate } from 'react-router-dom';
import { sidebarRoutes } from '../../routes/sidebarRoutes';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/context/use-auth';
import { logout as logoutRequest } from '@/services/authService';
import { navItemClass } from './NavItemClass';

export default function Sidebar() {
  const navigate = useNavigate();
  const auth = useAuth();

  const handleLogout = async () => {
    try {
      await logoutRequest();
    } catch {
      // ignore network errors
    }
    auth.logout();
    navigate('/login');
  };

  return (
    <aside className="bg-background border-border fixed left-0 top-0 z-40 hidden h-screen w-60 border-r px-4 py-6 shadow-sm md:flex md:flex-col">
      {/* Brand */}
      <div className="text-primary mb-10 select-none pl-1 text-2xl font-extrabold tracking-tight">
        IT <span className="text-foreground">APP</span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1">
        {sidebarRoutes.map((route) => {
          const Icon = route.icon;
          return (
            <NavLink
              key={route.path}
              to={route.path}
              className={({ isActive }) => navItemClass({ active: isActive })}
            >
              <Icon className="h-5 w-5 transition-transform group-hover:scale-110" />
              <span>{route.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer logout */}
      <div className="border-border mt-auto border-t pt-6">
        <button
          onClick={handleLogout}
          className="text-muted-foreground hover:bg-muted flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm transition"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
