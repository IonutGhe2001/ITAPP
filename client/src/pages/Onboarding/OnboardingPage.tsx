import { useState, useEffect } from "react";
import { useEchipamente } from "@/features/equipment/echipamenteService";
import { useOnboardingPackages, useSaveOnboarding } from "@/features/onboarding";
import type { OnboardingTask } from "@/features/onboarding";

const departments = ["IT", "Marketing"];

export default function OnboardingPage() {
  const { data: echipamente } = useEchipamente();
  const [department, setDepartment] = useState("");
  const [laptopId, setLaptopId] = useState("");
  const { data: packages } = useOnboardingPackages(department);
  const [tasks, setTasks] = useState<OnboardingTask[]>([]);
  const saveMutation = useSaveOnboarding();

  useEffect(() => {
    if (packages) {
      setTasks(packages.map((name) => ({ name, completed: false })));
    }
  }, [packages]);

  const handleToggle = (index: number) => {
    setTasks((prev) =>
      prev.map((t, i) => (i === index ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleSave = () => {
    if (!department || !laptopId) return;
    saveMutation.mutate({ department, laptopId, tasks });
  };

  const laptops =
    echipamente?.filter((e) => e.tip.toLowerCase() === "laptop") ?? [];

  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block mb-1">Departament</label>
        <select
          className="border p-2"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option value="">Selectează departamentul</option>
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block mb-1">Laptop</label>
        <select
          className="border p-2"
          value={laptopId}
          onChange={(e) => setLaptopId(e.target.value)}
        >
          <option value="">Selectează laptopul</option>
          {laptops.map((l) => (
            <option key={l.id} value={l.id}>
              {l.nume} - {l.serie}
            </option>
          ))}
        </select>
      </div>
      {tasks.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Checklist instalare</h3>
          <ul className="space-y-1">
            {tasks.map((task, idx) => (
              <li key={task.name}>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggle(idx)}
                  />
                  <span>{task.name}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
      <button
        className="bg-primary text-white px-4 py-2 rounded"
        disabled={!department || !laptopId}
        onClick={handleSave}
      >
        Salvează
      </button>
    </div>
  );
}