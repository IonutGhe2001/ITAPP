import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/context/useAuth';
import { logout as logoutRequest } from '@/services/authService';
import { navItemClass } from './NavItemClass';
import { sidebarRoutes } from '../../routes/sidebarRoutes';

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
    navigate(ROUTES.LOGIN);
  };

  return (
    <aside className="bg-background/95 border-border supports-[backdrop-filter]:bg-background/90 fixed left-0 top-0 z-40 hidden h-screen w-72 border-r px-6 py-8 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.4)] backdrop-blur md:flex md:flex-col">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 text-primary flex h-11 w-11 items-center justify-center rounded-xl text-lg font-semibold tracking-tight">
          IA
        </div>
        <div className="flex flex-col">
          <span className="text-foreground text-xl font-semibold tracking-tight">ITAPP</span>
          <span className="text-muted-foreground text-xs font-medium uppercase tracking-[0.28em]">
            Control Center
          </span>
        </div>
      </div>

      <div className="border-border/60 via-border my-8 h-px w-full bg-gradient-to-r from-transparent to-transparent" />

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1">
        {sidebarRoutes.map((route) => {
          const Icon = route.icon;
          return (
            <NavLink
              key={route.path}
              to={route.path}
              className={({ isActive }) => navItemClass({ active: isActive })}
            >
              <Icon className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
              <span className="text-sm font-semibold tracking-tight">{route.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4 pt-6">
        <div className="bg-muted/40 text-muted-foreground border-border/70 rounded-xl border border-dashed px-4 py-3 text-xs leading-relaxed">
          <p className="text-foreground mb-1 font-medium">Ai nevoie de ajutor?</p>
          <p>Contactează echipa IT pentru suport rapid.</p>
        </div>

        {/* Footer logout */}
        <button
          onClick={handleLogout}
          className="text-muted-foreground hover:border-primary/50 hover:bg-primary/10 hover:text-primary border-border/60 flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition"
        >
          <span className="flex items-center gap-3">
            <LogOut className="h-5 w-5" />
            Logout
          </span>
          <span className="text-xs uppercase tracking-wide">ieșire</span>
        </button>
      </div>
    </aside>
  );
}
