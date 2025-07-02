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
    <header className="flex justify-between items-center px-6 py-4 bg-white border-b-2 border-primary shadow-sm sticky top-0 z-40 text-gray-900">
      <h1 className="text-xl font-bold tracking-tight">{title}</h1>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-gray-100">
          <FaBell className="text-primary text-lg" />
        </button>

        <div className="flex items-center gap-3 bg-primary/10 px-3 py-2 rounded-lg">
          <FaUserCircle className="text-primary text-2xl" />
          <div className="text-sm leading-tight">
            <p className="font-semibold">Ionut G.</p>
            <p className="text-xs text-primary">IT Manager</p>
          </div>
        </div>
      </div>
    </header>
  );
}
