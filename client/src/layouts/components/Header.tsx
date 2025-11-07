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
      <header className="bg-background/80 border-border/80 sticky top-0 z-40 border-b px-6 py-3 shadow-[0_15px_40px_-30px_rgba(15,23,42,0.65)] backdrop-blur supports-[backdrop-filter]:backdrop-blur">
        <div className="flex items-center justify-between gap-6">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <button
              className="text-muted-foreground/80 hover:text-foreground border-border/80 bg-background/60 inline-flex h-10 w-10 items-center justify-center rounded-full border transition md:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Deschide meniul</span>
            </button>
            <div className="flex min-w-0 flex-col">
              <span className="text-muted-foreground/70 text-[10px] font-semibold uppercase tracking-[0.5em]">
                Monitorizare
              </span>
              <h1 className="text-foreground truncate text-lg font-semibold tracking-tight md:text-xl">
                {title}
              </h1>
            </div>
          </div>

          <div className="flex flex-shrink-0 items-center gap-3">
            <button
              className="text-muted-foreground/80 hover:text-foreground border-border/80 bg-background/60 inline-flex h-10 w-10 items-center justify-center rounded-full border transition md:hidden"
              onClick={() => setMobileSearchOpen(true)}
            >
              <Search className="h-4 w-4" />
              <span className="sr-only">Deschide căutarea</span>
            </button>

            <SearchInput className="hidden md:block md:w-72 lg:w-80" />

            <div className="bg-border/70 hidden h-8 w-px md:block" aria-hidden="true" />

          <NotificationsMenu />

            <div className="bg-border/70 hidden h-8 w-px md:block" aria-hidden="true" />

          <ThemeToggle />

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="hover:bg-muted/60 focus-visible:ring-primary/40 flex items-center gap-3 rounded-full px-2 pr-3"
                  >
                    <Avatar
                      src={user.profilePicture ?? undefined}
                      name={`${user.nume} ${user.prenume}`}
                      className="border-border h-9 w-9 border"
                    />
                    <div className="hidden flex-col text-left md:flex">
                      <span className="text-sm font-semibold leading-none">
                        {user.nume} {user.prenume?.charAt(0)}.
                      </span>
                      <span className="text-muted-foreground text-xs">{user.functie}</span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[10rem]">
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
