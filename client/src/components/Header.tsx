import { FaBell } from "react-icons/fa";
import { UserCircle } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@components/ui/dropdown-menu";
import { getCurrentUser } from "@/services/authService";


const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/echipamente": "Echipamente",
  "/colegi": "Colegi",
};

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const title = pageTitles[location.pathname] || "Pagina";

  const [user, setUser] = useState<{ nume: string; prenume: string; functie: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser().then((data) => {
      setUser(data);
      setLoading(false);
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleProfile = () => {
    navigate("/profil"); 
  };

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-900 border-b shadow-sm sticky top-0 z-40">
      <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
        {title}
      </h1>

      <div className="flex items-center gap-4">
        {/* Notificări */}
        <Button variant="ghost" size="icon">
          <FaBell className="text-primary text-lg" />
        </Button>

        {/* User Dropdown */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <UserCircle className="text-primary text-2xl" />
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-sm font-semibold">
                    {user.nume} {user.prenume?.charAt(0)}.
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {user.functie}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {loading ? (
                <DropdownMenuItem disabled>Se încarcă...</DropdownMenuItem>
              ) : user ? (
                <>
                  <DropdownMenuItem onClick={handleProfile}>
                    Profil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
