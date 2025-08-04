import { NavLink } from 'react-router-dom';
import { sidebarRoutes } from '../../routes/sidebarRoutes';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/context/use-auth';
import { logout as logoutRequest } from '@/services/authService';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { navItemClass } from './NavItemClass';

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
      <DialogContent className="bg-background border-border fixed inset-y-0 left-0 top-0 w-60 max-w-[50vw] translate-x-0 translate-y-0 rounded-none border-r p-6 shadow-sm focus:outline-none">
        <div className="text-primary mb-8 select-none pl-1 text-2xl font-extrabold tracking-tight">
          IT <span className="text-foreground">APP</span>
        </div>
        <nav className="mb-auto flex flex-col gap-1">
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
        <div className="border-border border-t pt-6">
          <button
            onClick={handleLogout}
            className="text-muted-foreground hover:bg-muted flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm transition"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
