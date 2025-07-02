import { useNavigate } from "react-router-dom";
import { ArrowRightIcon, MonitorIcon, UsersIcon } from "lucide-react";

export default function QuickAccess() {
  const navigate = useNavigate();

  const items = [
    { label: "Echipamente", route: "/echipamente", icon: <MonitorIcon className="w-5 h-5" /> },
    { label: "Colegi", route: "/colegi", icon: <UsersIcon className="w-5 h-5" /> },
  ];

  return (
    <section>
      <h2 className="text-sm font-semibold text-white mb-4">Accese rapide</h2>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li
            key={item.route}
            onClick={() => navigate(item.route)}
            className="flex items-center justify-between px-4 py-3 bg-white/20 hover:bg-white/30 rounded-xl cursor-pointer transition text-white"
          >
            <div className="flex items-center gap-3">
              <div className="text-white">{item.icon}</div>
              <span className="font-medium text-white">{item.label}</span>
            </div>
            <ArrowRightIcon className="w-4 h-4 text-white/70" />
          </li>
        ))}
      </ul>
    </section>
  );
}
