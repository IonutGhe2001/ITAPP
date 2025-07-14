"use client";

import { useNavigate } from "react-router-dom";
import { MonitorIcon, UsersIcon } from "lucide-react";

const shortcuts = [
  {
    id: 1,
    label: "Echipamente",
    route: "/echipamente",
    icon: <MonitorIcon className="w-5 h-5" />,
  },
  {
    id: 2,
    label: "Colegi",
    route: "/colegi",
    icon: <UsersIcon className="w-5 h-5" />,
  },
];

export default function NavigationShortcuts() {
  const navigate = useNavigate();

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {shortcuts.map((shortcut) => (
        <li
          key={shortcut.id}
          onClick={() => navigate(shortcut.route)}
          onKeyDown={(e) => e.key === "Enter" && navigate(shortcut.route)}
          role="button"
          tabIndex={0}
          className="flex items-center gap-4 p-4 rounded-xl bg-muted hover:bg-muted/80 transition cursor-pointer group focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
            {shortcut.icon}
          </div>
          <span className="text-sm font-medium text-foreground group-hover:underline">
            {shortcut.label}
          </span>
        </li>
      ))}
    </ul>
  );
}
