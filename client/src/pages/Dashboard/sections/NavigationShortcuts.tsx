"use client";

import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MonitorIcon, UsersIcon, UserCircle } from "lucide-react";

const shortcuts = [
  {
    id: 1,
    label: "Echipamente",
    route: "/echipamente",
    icon: <MonitorIcon className="w-5 h-5 stroke-[1.5]" />,
    color: "bg-chart-2/10 text-chart-2",
    keybinding: "1",
  },
  {
    id: 2,
    label: "Colegi",
    route: "/colegi",
    icon: <UsersIcon className="w-5 h-5 stroke-[1.5]" />,
    color: "bg-chart-1/10 text-chart-1",
    keybinding: "2",
  },
  {
    id: 3,
    label: "Profil",
    route: "/profil",
    icon: <UserCircle className="w-5 h-5 stroke-[1.5]" />,
    color: "bg-primary/10 text-primary",
    keybinding: "3",
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
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [navigate]);

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {shortcuts.map((shortcut) => {
        const isActive = location.pathname === shortcut.route;
        return (
          <li
            key={shortcut.id}
            onClick={() => navigate(shortcut.route)}
            onKeyDown={(e) => e.key === "Enter" && navigate(shortcut.route)}
            role="button"
            tabIndex={0}
            className={`flex items-center gap-4 p-4 rounded-xl border border-border transition cursor-pointer group focus:outline-none focus:ring-2 hover:scale-[1.02] duration-300 ${
              isActive
                ? "bg-primary/10 border-primary/30 ring-1 ring-primary/30"
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${shortcut.color} transition-all`}
            >
              {shortcut.icon}
            </div>
            <span className="text-sm font-medium text-foreground group-hover:underline">
              {shortcut.label}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
