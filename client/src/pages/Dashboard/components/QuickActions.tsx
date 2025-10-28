import { useMemo } from 'react';
import { LifeBuoy, Plus, Rocket, ServerCog } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: typeof LifeBuoy;
  onSelect: () => void;
}

const defaultActions: QuickAction[] = [
  {
    id: 'new-ticket',
    label: 'Ticket nou',
    description: 'Înregistrează un incident pentru echipa de suport.',
    icon: LifeBuoy,
    onSelect: () => console.info('Ticket nou inițiat'),
  },
  {
    id: 'deploy',
    label: 'Lansare deployment',
    description: 'Pregătește un nou release pentru mediul de staging.',
    icon: Rocket,
    onSelect: () => console.info('Deployment planificat'),
  },
  {
    id: 'request-access',
    label: 'Solicitare acces',
    description: 'Trimite o cerere pentru resurse interne sensibile.',
    icon: Plus,
    onSelect: () => console.info('Solicitare acces trimisă'),
  },
  {
    id: 'maintenance',
    label: 'Programare mentenanță',
    description: 'Rezervă un interval pentru mentenanța echipamentelor.',
    icon: ServerCog,
    onSelect: () => console.info('Mentenanță programată'),
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