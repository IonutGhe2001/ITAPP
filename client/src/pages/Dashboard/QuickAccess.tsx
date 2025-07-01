import { useNavigate } from "react-router-dom";
import { ArrowRightIcon } from "lucide-react";

export default function QuickAccess() {
  const navigate = useNavigate();

  const items = [
    { label: "Echipamente", route: "/echipamente" },
    { label: "Colegi", route: "/colegi" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <h2 className="text-sm font-semibold text-gray-600 mb-4">Accese rapide</h2>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li
            key={item.route}
            onClick={() => navigate(item.route)}
            className="flex items-center justify-between px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer"
          >
            <span>{item.label}</span>
            <ArrowRightIcon className="w-4 h-4 text-gray-500" />
          </li>
        ))}
      </ul>
    </div>
  );
}
