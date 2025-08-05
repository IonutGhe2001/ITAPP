import { Search, Menu } from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@components/ui/button';
import ThemeToggle from '@components/ThemeToggle';
import Avatar from '@/components/Avatar';
import { useUser } from '@/context/useUser';
import { removeToken } from '@/utils/storage';
import pageTitles from '@/constants/pageTitles';
import { ROUTES } from '@/constants/routes';
import MobileSidebar from '@layouts/components/MobileSideBar';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import SearchInput from '@/components/SearchInput';
import NotificationsMenu from '@layouts/components/NotificationsMenu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';
import { useEchipament } from '@/features/equipment';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const equipmentDetailMatch = location.pathname.match(/^\/echipamente\/([^/]+)/);
  const equipmentId = equipmentDetailMatch ? equipmentDetailMatch[1] : null;
  const { data: equipment } = useEchipament(equipmentId || '');
  const title = equipmentId
    ? `INFO: ${equipment?.nume ?? equipmentId}`
    : pageTitles[location.pathname] || 'Pagina';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const { user, loading } = useUser();

  const handleLogout = () => {
    removeToken();
    navigate(ROUTES.LOGIN);
  };

  const handleProfile = () => {
    navigate(ROUTES.PROFILE);
  };

  return (
    <>
      <header className="bg-background border-border sticky top-0 z-40 flex items-center justify-between border-b px-6 py-4 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            className="text-muted-foreground md:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Deschide meniul</span>
          </button>
          <div className="flex flex-col">
            <h1 className="text-muted-foreground text-sm uppercase tracking-wide">{title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            className="text-muted-foreground md:hidden"
            onClick={() => setMobileSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Deschide căutarea</span>
          </button>

          <SearchInput className="hidden md:block" />

          <NotificationsMenu />

          <ThemeToggle />

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="hover:bg-muted flex items-center gap-2 px-2">
                  <Avatar
                    src={user.profilePicture ?? undefined}
                    name={`${user.nume} ${user.prenume}`}
                    className="border-border h-8 w-8 border"
                  />
                  <div className="hidden flex-col text-left md:flex">
                    <span className="text-sm font-semibold">
                      {user.nume} {user.prenume?.charAt(0)}.
                    </span>
                    <span className="text-muted-foreground text-xs">{user.functie}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {loading ? (
                  <DropdownMenuItem disabled>Se încarcă...</DropdownMenuItem>
                ) : (
                  <>
                    <DropdownMenuItem onClick={handleProfile}>Profil</DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
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
