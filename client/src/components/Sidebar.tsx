import { NavLink } from "react-router-dom";
import { FaHome, FaUsers, FaLaptop } from "react-icons/fa";

export default function Sidebar() {
  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg ${
      isActive ? "bg-white text-red-600 font-bold" : "hover:bg-red-500"
    }`;

  return (
    <div className="w-60 bg-red-600 text-white flex flex-col py-8 px-4 min-h-screen">
      <div className="text-2xl font-bold mb-8 pl-1">IT APP</div>
      <nav className="flex flex-col gap-3 text-base">
        <NavLink to="/" className={navItemClass}>
          <FaHome /> Dashboard
        </NavLink>
        <NavLink to="/echipamente" className={navItemClass}>
          <FaLaptop /> Echipamente
        </NavLink>
        <NavLink to="/colegi" className={navItemClass}>
          <FaUsers /> Colegi
        </NavLink>
      </nav>
    </div>
  );
}
