'use client';

import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MonitorIcon, UsersIcon, UserCircle, ArrowUpRightIcon } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';

const shortcuts = [
  {
    id: 1,
    label: 'Echipamente',
    route: ROUTES.EQUIPMENT,
    icon: <MonitorIcon className="h-5 w-5" />,
    color: 'from-violet-500/15 via-violet-500/0 to-transparent text-violet-600 dark:text-violet-400',
    keybinding: '1',
    description: 'Gestionează inventarul hardware și statusul asignărilor.',
  },
  {
    id: 2,
    label: 'Colegi',
    route: ROUTES.COLEGI,
    icon: <UsersIcon className="h-5 w-5" />,
    color: 'from-sky-500/15 via-sky-500/0 to-transparent text-sky-600 dark:text-sky-400',
    keybinding: '2',
    description: 'Explorează profilurile colegilor și datele de contact.',
  },
  {
    id: 3,
    label: 'Profil',
    route: ROUTES.PROFILE,
    icon: <UserCircle className="h-5 w-5" />,
    color: 'from-emerald-500/15 via-emerald-500/0 to-transparent text-emerald-600 dark:text-emerald-400',
    keybinding: '3',
    description: 'Actualizează preferințele și setările personale.',
  },
];

export default function NavigationShortcuts() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        const shortcut = shortcuts.find((s) => s.keybinding === e.key);
        if (shortcut) {
          e.preventDefault();
          navigate(shortcut.route);
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [navigate]);

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {shortcuts.map((shortcut) => {
        const isActive = location.pathname === shortcut.route;
        return (
          <li
            key={shortcut.id}
            onClick={() => navigate(shortcut.route)}
            onKeyDown={(e) => e.key === 'Enter' && navigate(shortcut.route)}
            role="button"
            tabIndex={0}
            className={cn(
              'group relative flex h-full cursor-pointer flex-col gap-4 overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-muted/70 via-background to-background p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
              shortcut.color,
              isActive && 'border-primary/50 bg-primary/5 shadow-lg'
            )}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/80 text-current shadow-sm ring-1 ring-border/70">
                {shortcut.icon}
              </span>
              <div className="flex flex-col">
                <span className="text-foreground text-base font-semibold">{shortcut.label}</span>
                <span className="text-muted-foreground text-xs">Ctrl + {shortcut.keybinding}</span>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">{shortcut.description}</p>
            <ArrowUpRightIcon className="ml-auto h-4 w-4 text-primary transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
          </li>
        );
      })}
    </ul>
  );
}
