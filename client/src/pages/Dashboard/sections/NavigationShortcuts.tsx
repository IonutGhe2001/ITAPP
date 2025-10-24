'use client';

import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MonitorIcon, UsersIcon, UserCircle } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

const shortcuts = [
  {
    id: 1,
    label: 'Echipamente',
    route: ROUTES.EQUIPMENT,
    icon: <MonitorIcon className="h-5 w-5 stroke-[1.5]" />,
    color: 'bg-chart-2/10 text-chart-2',
    keybinding: '1',
  },
  {
    id: 2,
    label: 'Colegi',
    route: ROUTES.COLEGI,
    icon: <UsersIcon className="h-5 w-5 stroke-[1.5]" />,
    color: 'bg-chart-1/10 text-chart-1',
    keybinding: '2',
  },
  {
    id: 3,
    label: 'Profil',
    route: ROUTES.PROFILE,
    icon: <UserCircle className="h-5 w-5 stroke-[1.5]" />,
    color: 'bg-primary/10 text-primary',
    keybinding: '3',
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
            className={`group relative flex cursor-pointer items-center gap-4 rounded-2xl border border-border/60 bg-background/80 p-4 shadow-inner shadow-primary/5 transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/30 ${
              isActive ? 'border-primary/50 shadow-primary/20' : ''
            }`}
          >
            <div
              className={`relative flex h-12 w-12 items-center justify-center rounded-xl ${shortcut.color}`}
            >
              {shortcut.icon}
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <span className="text-foreground text-sm font-semibold group-hover:text-primary">
                {shortcut.label}
              </span>
              <span className="text-muted-foreground text-xs">Navighează cu Ctrl + {shortcut.keybinding}</span>
            </div>
            <span className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wide">
              Ctrl + {shortcut.keybinding}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
