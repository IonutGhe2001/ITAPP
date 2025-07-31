import { Search, Menu } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@components/ui/button";
import ThemeToggle from "@components/ThemeToggle";
import Avatar from "@/components/Avatar";
import { useUser } from "@/store/use-user";
import { removeToken } from "@/utils/storage";
import pageTitles from "@/constants/pageTitles";
import MobileSidebar from "@layouts/components/MobileSideBar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import SearchInput from "@/components/SearchInput";
import NotificationsMenu from "@layouts/components/NotificationsMenu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const title = pageTitles[location.pathname] || "Pagina";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

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
         <button
          className="md:hidden text-muted-foreground"
          onClick={() => setMobileSearchOpen(true)}
        >
          <Search className="w-5 h-5" />
          <span className="sr-only">Deschide căutarea</span>
        </button>

        <SearchInput className="hidden md:block" />

        <NotificationsMenu />

<ThemeToggle />

        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-muted">
                 <Avatar
                  src={user.profilePicture ?? undefined}
                  name={`${user.nume} ${user.prenume}`}
                  className="w-8 h-8 border border-border"
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
    <Dialog open={mobileSearchOpen} onOpenChange={setMobileSearchOpen}>
      <DialogContent className="p-4">
        <SearchInput onSelect={() => setMobileSearchOpen(false)} />
      </DialogContent>
    </Dialog>
    </>
  );
}
