import { useMemo } from 'react';
import { Download, FileText, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: typeof Plus;
  onSelect: () => void;
}

const defaultActions: QuickAction[] = [
  {
    id: 'add-equipment',
    label: 'Adaugă echipament',
    description: 'Înregistrează rapid un activ nou în inventar.',
    icon: Plus,
    onSelect: () => console.info('Acțiune: adaugă echipament'),
  },
  {
    id: 'generate-pv',
    label: 'Generează PV',
    description: 'Pornește procesul de creare a unui nou proces-verbal.',
    icon: FileText,
    onSelect: () => console.info('Acțiune: generează PV'),
  },
  {
    id: 'export-csv',
    label: 'Exportă CSV',
    description: 'Descarcă lista de echipamente într-un fișier CSV.',
    icon: Download,
    onSelect: () => console.info('Acțiune: exportă CSV'),
  },
];

interface QuickActionsProps {
  actions?: QuickAction[];
}

export function QuickActions({ actions }: QuickActionsProps) {
  const items = useMemo(() => actions ?? defaultActions, [actions]);

  return (
    <ul className="space-y-3" aria-label="Acțiuni rapide">
      {items.map((action) => {
        const Icon = action.icon;
        return (
          <li key={action.id} className="flex items-start justify-between gap-3 rounded-lg border border-border bg-card/60 p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary" aria-hidden>
                <Icon className="h-5 w-5" />
              </span>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">{action.label}</p>
                <p className="text-sm text-muted-foreground">{action.description}</p>
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
  );
}