"use client";

import { useNavigate } from "react-router-dom";
import { MonitorIcon, UsersIcon } from "lucide-react";

const shortcuts = [
  {
    id: 1,
    label: "Echipamente",
    route: "/echipamente",
    icon: <MonitorIcon className="w-5 h-5 stroke-[1.5]" />,
    color: "bg-chart-2/10 text-chart-2",
  },
  {
    id: 2,
    label: "Colegi",
    route: "/colegi",
    icon: <UsersIcon className="w-5 h-5 stroke-[1.5]" />,
    color: "bg-chart-1/10 text-chart-1",
  },
];

export default function NavigationShortcuts() {
  const navigate = useNavigate();

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {shortcuts.map((shortcut) => (
        <li
          key={shortcut.id}
          onClick={() => navigate(shortcut.route)}
          onKeyDown={(e) => e.key === "Enter" && navigate(shortcut.route)}
          role="button"
          tabIndex={0}
          className="flex items-center gap-4 p-4 rounded-xl border border-border bg-muted hover:bg-muted/80 transition cursor-pointer group focus:outline-none focus:ring-2 focus:ring-primary hover:scale-[1.02] duration-300"
        >
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${shortcut.color} transition-all`}>
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
