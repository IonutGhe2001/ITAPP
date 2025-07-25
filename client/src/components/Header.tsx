import { FaBell } from "react-icons/fa";
import { Search, Menu } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { useUser } from "@/store/UserContext";
import { removeToken } from "@/utils/storage"; 
import pageTitles from "@/constants/pageTitles";
import MobileSidebar from "@/components/MobileSidebar"; 

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const title = pageTitles[location.pathname] || "Pagina";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { user, loading } = useUser();

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  const handleProfile = () => {
    navigate("/profil");
  };

  return (
    <>
    <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 bg-background shadow-sm border-b border-border">
      <div className="flex items-center gap-2">
        <button
          className="md:hidden text-muted-foreground"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className="w-6 h-6" />
          <span className="sr-only">Deschide meniul</span>
        </button>
        <div className="flex flex-col">
          <h1 className="text-sm text-muted-foreground tracking-wide uppercase">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Caută..."
            className="pl-9 pr-4 py-2 text-sm bg-muted text-foreground rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <Button variant="ghost" size="icon" className="hover:bg-muted">
          <FaBell className="text-muted-foreground" />
        </Button>

        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-muted">
                 <img
                    src={user.profilePicture || "/profile.png"}
                    alt="User"
                    loading="lazy"
                    className="w-8 h-8 rounded-full object-cover border border-border"
                  />
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-sm font-semibold">
                    {user.nume} {user.prenume?.charAt(0)}.
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {user.functie}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {loading ? (
                <DropdownMenuItem disabled>Se încarcă...</DropdownMenuItem>
              ) : (
                <>
                  <DropdownMenuItem onClick={handleProfile}>
                    Profil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
    <MobileSidebar open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} />
    </>
  );
}
