import { FaBell } from "react-icons/fa";
import { Search, Menu, UserIcon, MonitorIcon, PhoneIcon } from "lucide-react";
import { useState, type FormEvent, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSearch } from "@/context/use-search";
import { Button } from "@components/ui/button";
import ThemeToggle from "@components/ThemeToggle";
import { useSearchSuggestions } from "@/services/searchService";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { useUser } from "@/store/use-user";
import { removeToken } from "@/utils/storage"; 
import pageTitles from "@/constants/pageTitles";
import MobileSidebar from "@layouts/components/MobileSideBar";
import { useNotifications } from "@/context/use-notifications";
import { formatDistanceToNow } from "date-fns";
import { ro } from "date-fns/locale";

const updateIcons = {
  Echipament: <MonitorIcon className="w-4 h-4" />,
  Coleg: <UserIcon className="w-4 h-4" />,
  SIM: <PhoneIcon className="w-4 h-4" />,
};

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const title = pageTitles[location.pathname] || "Pagina";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { query, setQuery } = useSearch();

  const { user, loading } = useUser();
const { data: suggestionData } = useSearchSuggestions(query);
const { notifications, unreadCount, markAllRead } = useNotifications();
  const [activeIndex, setActiveIndex] = useState(-1);
  const suggestions = useMemo(
    () => [
      ...(suggestionData?.echipamente.map((e) => e.nume) || []),
      ...(suggestionData?.angajati.map((a) => a.numeComplet) || []),
    ],
    [suggestionData]
  );

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

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
         <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Caută..."
            className="pl-9 pr-4 py-2 text-sm bg-muted text-foreground rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary"
             value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(-1);
            }}
            onKeyDown={(e) => {
              if (!suggestions.length) return;
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActiveIndex((i) => Math.max(i - 1, 0));
              } else if (e.key === "Enter") {
                if (activeIndex >= 0 && suggestions[activeIndex]) {
                  e.preventDefault();
                  const val = suggestions[activeIndex];
                  setQuery(val);
                  navigate(`/search?q=${encodeURIComponent(val)}`);
                }
              }
            }}
          />
          {suggestions.length > 0 && (
            <ul className="absolute left-0 right-0 mt-1 bg-background border border-border rounded-md shadow z-50">
              {suggestions.map((s, idx) => (
                <li
                  key={idx}
                  className={cn(
                    "px-3 py-1 text-sm cursor-pointer",
                    idx === activeIndex && "bg-muted"
                  )}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setQuery(s);
                    navigate(`/search?q=${encodeURIComponent(s)}`);
                  }}
                  onMouseEnter={() => setActiveIndex(idx)}
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </form>

        <DropdownMenu onOpenChange={(open) => open && markAllRead()}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative hover:bg-muted">
              <FaBell className="text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <DropdownMenuItem disabled>Nu există notificări</DropdownMenuItem>
            ) : (
              notifications.map((n) => (
                <DropdownMenuItem key={n.id} className="flex gap-3">
                  <div className="mt-1">{updateIcons[n.type]}</div>
                  <div className="flex flex-col">
                    <span className="text-sm">{n.message}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(n.timestamp), { addSuffix: true, locale: ro })}
                    </span>
                  </div>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

<ThemeToggle />

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
