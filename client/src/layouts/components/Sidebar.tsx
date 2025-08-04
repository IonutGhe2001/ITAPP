import { NavLink, useNavigate } from "react-router-dom";
import { sidebarRoutes } from "../../routes/sidebarRoutes";
import { LogOut } from "lucide-react";
import { useAuth } from "@/context/use-auth";
import { logout as logoutRequest } from "@/services/authService";
import { navItemClass } from "./NavItemClass";

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
    navigate("/login");
  };

  return (
    <aside className="hidden md:flex md:flex-col fixed top-0 left-0 h-screen w-60 bg-background border-r border-border py-6 px-4 z-40 shadow-sm">
      {/* Brand */}
      <div className="text-2xl font-extrabold text-primary mb-10 tracking-tight pl-1 select-none">
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
              <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>{route.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer logout */}
      <div className="mt-auto pt-6 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-muted-foreground hover:bg-muted transition text-sm w-full"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
