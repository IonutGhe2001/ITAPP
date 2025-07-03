import { FaBell } from "react-icons/fa";
import { UserCircle } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { Button } from "@components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@components/ui/dropdown-menu";


const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/echipamente": "Echipamente",
  "/colegi": "Colegi",
};

export default function Header() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "Pagina";
  const navigate = useNavigate();
  const handleLogout = () => {
  localStorage.removeItem("token");
  navigate("/login");
};

  const [user, setUser] = useState<{
    nume: string;
    prenume: string;
    functie: string;
  } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios.get("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Eroare la /me:", err));
  }, []);

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
            <DropdownMenuContent>
              <DropdownMenuItem>Profil</DropdownMenuItem>
             <DropdownMenuItem onClick={handleLogout}>
  Logout
</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
