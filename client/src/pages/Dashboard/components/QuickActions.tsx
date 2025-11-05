import { useMemo, useState, Suspense, lazy } from 'react';
import { Download, FileText, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

const ModalAddEchipament = lazy(() => import('../modals/ModalAddEchipament'));
const ModalProcesVerbal = lazy(() => import('../modals/ModalProcesVerbal'));

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: typeof Plus;
  onSelect: () => void;
}

interface QuickActionsProps {
  actions?: QuickAction[];
}

export function QuickActions({ actions }: QuickActionsProps) {
  const [showAddEquipmentModal, setShowAddEquipmentModal] = useState(false);
  const [showPVModal, setShowPVModal] = useState(false);

  const items = useMemo(() => {
    const defaultActions: QuickAction[] = [
      {
        id: 'add-equipment',
        label: 'Adaugă echipament',
        description: 'Înregistrează rapid un activ nou în inventar.',
        icon: Plus,
        onSelect: () => setShowAddEquipmentModal(true),
      },
      {
        id: 'generate-pv',
        label: 'Generează PV',
        description: 'Pornește procesul de creare a unui nou proces-verbal.',
        icon: FileText,
        onSelect: () => setShowPVModal(true),
      },
      {
        id: 'export-csv',
        label: 'Exportă CSV',
        description: 'Descarcă lista de echipamente într-un fișier CSV.',
        icon: Download,
        onSelect: () => {
          // Trigger CSV export via hidden link
          const link = document.createElement('a');
          link.href = '/api/echipamente/export/csv';
          link.download = 'echipamente.csv';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        },
      },
    ];
    
    return actions ?? defaultActions;
  }, [actions]);

  return (
    <>
      <ul className="space-y-3" aria-label="Acțiuni rapide">
        {items.map((action) => {
          const Icon = action.icon;
          return (
            <li
              key={action.id}
              className="border-border/70 bg-card/70 flex items-start justify-between gap-4 rounded-lg border p-4"
            >
              <div className="flex items-start gap-3">
                <span
                  className="bg-primary/10 text-primary inline-flex size-10 items-center justify-center rounded-full"
                  aria-hidden
                >
                  <Icon className="size-5 stroke-[1.5]" />
                </span>
                <div className="space-y-1">
                  <p className="text-foreground text-sm font-semibold">{action.label}</p>
                  <p className="text-muted-foreground text-sm">{action.description}</p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={action.onSelect}
                aria-label={action.label}
              >
                Execută
              </Button>
            </li>
          );
        })}
      </ul>

      <Suspense fallback={null}>
        {showAddEquipmentModal && (
          <ModalAddEchipament onClose={() => setShowAddEquipmentModal(false)} />
        )}
      </Suspense>

      <Suspense fallback={null}>
        {showPVModal && <ModalProcesVerbal onClose={() => setShowPVModal(false)} />}
      </Suspense>
    </>
  );
}