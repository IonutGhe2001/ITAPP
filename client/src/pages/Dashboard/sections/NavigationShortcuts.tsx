"use client";

import { useNavigate } from "react-router-dom";
import { MonitorIcon, UsersIcon } from "lucide-react";

const shortcuts = [
  {
    id: 1,
    label: "Echipamente",
    route: "/echipamente",
    icon: <MonitorIcon className="w-6 h-6" />,
  },
  {
    id: 2,
    label: "Colegi",
    route: "/colegi",
    icon: <UsersIcon className="w-6 h-6" />,
  },
];

export default function NavigationShortcuts() {
  const navigate = useNavigate();

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-pink-600 flex items-center gap-2">
        🔗 Navigare rapidă
      </h2>
      <ul className="flex flex-col gap-4">
        {shortcuts.map((shortcut) => (
          <li
            key={shortcut.id}
            onClick={() => navigate(shortcut.route)}
            className="flex items-center gap-4 bg-white/80 backdrop-blur-lg rounded-3xl p-5 shadow-xl hover:scale-[1.03] transition-all duration-300 ease-out cursor-pointer"
          >
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-pink-100 text-pink-600 shadow-inner">
              {shortcut.icon}
            </div>
            <span className="text-lg font-semibold text-pink-600">{shortcut.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
