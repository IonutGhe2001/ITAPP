'use client';

import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MonitorIcon, UsersIcon, UserCircle } from 'lucide-react';

const shortcuts = [
  {
    id: 1,
    label: 'Echipamente',
    route: '/echipamente',
    icon: <MonitorIcon className="h-5 w-5 stroke-[1.5]" />,
    color: 'bg-chart-2/10 text-chart-2',
    keybinding: '1',
  },
  {
    id: 2,
    label: 'Colegi',
    route: '/colegi',
    icon: <UsersIcon className="h-5 w-5 stroke-[1.5]" />,
    color: 'bg-chart-1/10 text-chart-1',
    keybinding: '2',
  },
  {
    id: 3,
    label: 'Profil',
    route: '/profil',
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
            className={`border-border group flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 ${
              isActive
                ? 'bg-primary/10 border-primary/30 ring-primary/30 ring-1'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${shortcut.color} transition-all`}
            >
              {shortcut.icon}
            </div>
            <span className="text-foreground text-sm font-medium group-hover:underline">
              {shortcut.label}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
