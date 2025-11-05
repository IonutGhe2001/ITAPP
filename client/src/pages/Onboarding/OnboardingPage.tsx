import { useState, useEffect } from 'react';
import { useEchipamente } from '@/features/equipment/echipamenteService';
import { useOnboardingPackages, useSaveOnboarding } from '@/features/onboarding';
import type { OnboardingTask } from '@/features/onboarding';
import { useToast } from '@/hooks/use-toast/use-toast-hook';

const departments = ['IT', 'Marketing'];

export default function OnboardingPage() {
  const {
    data: echipamente = [],
    isLoading: isLoadingEchipamente,
    isFetching: isFetchingEchipamente,
  } = useEchipamente({ type: 'laptop', status: 'in_stoc', autoFetchAll: false });
  const [department, setDepartment] = useState('');
  const [laptopId, setLaptopId] = useState('');
  const { data: packages } = useOnboardingPackages(department);
  const [tasks, setTasks] = useState<OnboardingTask[]>([]);
  const saveMutation = useSaveOnboarding();
  const { toast } = useToast();

  useEffect(() => {
    if (packages) {
      setTasks(packages.map((name) => ({ name, completed: false })));
    }
  }, [packages]);

  const handleToggle = (index: number) => {
    setTasks((prev) => prev.map((t, i) => (i === index ? { ...t, completed: !t.completed } : t)));
  };

  const handleSave = () => {
    if (!department || !laptopId) return;
    saveMutation.mutate(
      { department, laptopId, tasks },
      {
        onSuccess: () => {
          toast({
            title: 'Onboarding salvat',
            description: 'Onboardingul a fost salvat cu succes.',
          });
          setDepartment('');
          setLaptopId('');
          setTasks([]);
        },
        onError: (error) => {
          toast({
            title: 'A apărut o eroare',
            description: error.message || 'Nu am putut salva onboardingul.',
            variant: 'destructive',
          });
        },
      }
    );
  };

  const isLoadingLaptops =
    isLoadingEchipamente || (isFetchingEchipamente && echipamente.length === 0);
  const laptops = echipamente.filter((e) => e.tip.toLowerCase() === 'laptop');

  return (
    <div className="space-y-4 p-4">
      <div>
        <label className="mb-1 block">Departament</label>
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
        <label className="mb-1 block">Laptop</label>
        <select
          className="border p-2"
          value={laptopId}
          onChange={(e) => setLaptopId(e.target.value)}
          disabled={isLoadingLaptops}
        >
          <option value="">Selectează laptopul</option>
          {laptops.map((l) => (
            <option key={l.id} value={l.id}>
              {l.nume} - {l.serie}
            </option>
          ))}
        </select>
        {isLoadingLaptops && (
          <div className="mt-2 flex items-center space-x-2 text-sm text-gray-500">
            <span className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
            <span>Se încarcă laptopurile...</span>
          </div>
        )}
      </div>
      {tasks.length > 0 && (
        <div>
          <h3 className="mb-2 font-semibold">Checklist instalare</h3>
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
        className="bg-primary flex items-center justify-center gap-2 rounded px-4 py-2 text-white"
        disabled={!department || !laptopId || saveMutation.isPending}
        onClick={handleSave}
      >
        {saveMutation.isPending && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/80 border-t-transparent" />
        )}
        <span>{saveMutation.isPending ? 'Se salvează...' : 'Salvează'}</span>
      </button>
    </div>
  );
}
