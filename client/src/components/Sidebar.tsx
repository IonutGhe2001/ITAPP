
import { NavLink, useNavigate } from "react-router-dom";
import { FaHome, FaUsers, FaLaptop } from "react-icons/fa";
import { LogOut } from "lucide-react";

export default function Sidebar() {
  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg transition font-medium ${
      isActive ? "bg-white text-primary" : "text-white/90 hover:bg-white/10"
    }`;

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside className="hidden md:flex md:flex-col w-60 bg-gradient-to-b from-primary to-primary-dark text-sm py-8 px-4 min-h-screen">
      <div className="text-2xl font-bold text-white mb-8 pl-1">IT APP</div>
      <nav className="flex flex-col gap-2">
        <NavLink to="/" className={navItemClass}>
          <FaHome className="text-base" /> Dashboard
        </NavLink>
        <NavLink to="/echipamente" className={navItemClass}>
          <FaLaptop className="text-base" /> Echipamente
        </NavLink>
        <NavLink to="/colegi" className={navItemClass}>
          <FaUsers className="text-base" /> Colegi
        </NavLink>
      </nav>

      <div className="mt-auto pt-4 border-t border-white/20">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-white/90 hover:bg-white/10 transition text-sm w-full"
        >
          <LogOut className="text-base" />
          Logout
        </button>
      </div>
    </aside>
  );
}
