import { FaBell, FaUserCircle } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/echipamente": "Echipamente",
  "/colegi": "Colegi",
};

export default function Header() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "Pagina";

  return (
    <header className="flex justify-between items-center px-6 py-4 border-b shadow-sm">
      <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
      
      <div className="flex items-center gap-4">
        <FaBell className="text-red-600 text-xl cursor-pointer" />
        <FaUserCircle className="text-gray-600 text-3xl cursor-pointer" />
        <div className="text-right">
          <p className="font-semibold text-sm">Ionut G.</p>
          <p className="text-xs text-gray-500">IT Manager</p>
        </div>
      </div>
    </header>
  );
}
