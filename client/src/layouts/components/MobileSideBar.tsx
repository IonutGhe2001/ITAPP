import { NavLink } from "react-router-dom";
import { sidebarRoutes } from "../../routes/sidebarRoutes";
import { LogOut } from "lucide-react";
import { useAuth } from "@/context/use-auth";
import { logout as logoutRequest } from "@/services/authService";
import { Dialog, DialogContent } from "@/components/ui/dialog";

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

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition ${
      isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
    }`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="fixed inset-y-0 left-0 top-0 w-60 max-w-[50vw] translate-x-0 translate-y-0 p-6 bg-background border-r border-border rounded-none shadow-sm focus:outline-none"
      >
        <div className="text-2xl font-extrabold text-primary mb-8 tracking-tight pl-1 select-none">
          IT <span className="text-foreground">APP</span>
        </div>
        <nav className="flex flex-col gap-1 mb-auto">
          {sidebarRoutes.map((route) => {
            const Icon = route.icon;
            return (
              <NavLink
                key={route.path}
                to={route.path}
                className={navItemClass}
                onClick={() => onOpenChange(false)}
              >
                <Icon className="w-5 h-5" />
                <span>{route.label}</span>
              </NavLink>
            );
          })}
        </nav>
        <div className="pt-6 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-muted-foreground hover:bg-muted transition text-sm w-full"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}