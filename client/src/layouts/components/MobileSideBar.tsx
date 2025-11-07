import { NavLink } from 'react-router-dom';
import { LogOut } from 'lucide-react';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAuth } from '@/context/useAuth';
import { logout as logoutRequest } from '@/services/authService';
import { navItemClass } from './NavItemClass';
import { sidebarRoutes } from '../../routes/sidebarRoutes';

interface MobileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MobileSidebar({ open, onOpenChange }: MobileSidebarProps) {
  const auth = useAuth();

  const handleLogout = async () => {
    try {
      await logoutRequest();
    } catch {
      // ignore network errors
    }
    auth.logout();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background/95 border-border fixed inset-y-0 left-0 top-0 w-72 max-w-[85vw] translate-x-0 translate-y-0 rounded-none border-r px-6 py-8 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.45)] backdrop-blur focus:outline-none">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl text-base font-semibold">
            IA
          </div>
          <div className="flex flex-col">
            <span className="text-foreground text-lg font-semibold tracking-tight">ITAPP</span>
            <span className="text-muted-foreground text-[10px] font-semibold uppercase tracking-[0.4em]">
              Control Center
            </span>
          </div>
        </div>

        <nav className="mb-auto mt-8 flex flex-col gap-1">
          {sidebarRoutes.map((route) => {
            const Icon = route.icon;
            return (
              <NavLink
                key={route.path}
                to={route.path}
                className={({ isActive }) => navItemClass({ active: isActive })}
                onClick={() => onOpenChange(false)}
              >
                <Icon className="h-5 w-5" />
                <span>{route.label}</span>
              </NavLink>
            );
          })}
        </nav>
        <div className="mt-8 space-y-4">
          <div className="bg-muted/40 text-muted-foreground border-border/70 rounded-xl border border-dashed px-4 py-3 text-xs leading-relaxed">
            <p className="text-foreground mb-1 font-medium">Ai nevoie de ajutor?</p>
            <p>Contactează echipa IT pentru suport rapid.</p>
          </div>
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
      </DialogContent>
    </Dialog>
  );
}
