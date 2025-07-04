import { NavLink, useNavigate } from "react-router-dom";
import { sidebarRoutes } from "../routes/sidebarRoutes";
import { LogOut } from "lucide-react";

export default function Sidebar() {
  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2 rounded-md transition font-medium ${
      isActive ? "bg-white text-primary" : "text-white/90 hover:bg-white/10"
    }`;

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside className="hidden md:flex md:flex-col fixed top-0 left-0 h-screen w-60 bg-gradient-to-b from-primary to-primary-dark text-sm py-8 px-4 z-40">
      <div className="text-2xl font-bold text-white mb-8 pl-1">IT APP</div>
      <nav className="flex flex-col gap-2">
        {sidebarRoutes.map((route) => {
          const Icon = route.icon;
          return (
            <NavLink key={route.path} to={route.path} className={navItemClass}>
              <Icon className="text-base" />
              {route.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-white/20">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 rounded-md text-white/90 hover:bg-white/10 transition text-sm w-full"
        >
          <LogOut className="text-base" />
          Logout
        </button>
      </div>
    </aside>
  );
}
