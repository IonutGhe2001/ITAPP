import { useMemo, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ro } from 'date-fns/locale';
import { AlertTriangle, FileText } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import type { PvQueueItem } from '../api';
import { EmptyState } from './EmptyState';
import { SearchInput } from './SearchInput';

interface PvQueueProps {
  items: PvQueueItem[];
  isLoading?: boolean;
  onGenerate: (item: PvQueueItem) => void;
  className?: string;
}

const skeletonItems = Array.from({ length: 4 });

const statusConfig: Record<PvQueueItem['status'], { label: string; variant: 'default' | 'secondary'; icon?: typeof AlertTriangle }> = {
  pending: { label: 'În așteptare', variant: 'secondary' },
  overdue: { label: 'Întârziat', variant: 'default', icon: AlertTriangle },
};

export function PvQueue({ items, isLoading, onGenerate, className }: PvQueueProps) {
  const [search, setSearch] = useState('');

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;
    return items.filter((item) =>
      [item.employee, item.equipment, item.location].some((value) => value.toLowerCase().includes(query))
    );
  }, [items, search]);

  return (
    <div className={cn('flex h-full min-h-0 flex-col gap-4', className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">Procès-verbal în așteptare</p>
          <p className="text-xs text-muted-foreground">
            Gestionează rapid documentele de predare pentru echipamentele recent alocate.
          </p>
        </div>
        <SearchInput
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Caută după coleg sau echipament"
          aria-label="Caută în lista de PV"
          className="w-full sm:w-64"
        />
      </div>

      {isLoading ? (
        <div className="flex-1 space-y-3" aria-hidden>
          {skeletonItems.map((_, index) => (
            <div key={index} className="h-[84px] animate-pulse rounded-lg border border-border bg-muted/30" />
          ))}
        </div>
      ) : filteredItems.length ? (
        <div className="flex-1 min-h-0">
          <ul className="flex h-full flex-col gap-3 overflow-y-auto pr-1" aria-live="polite">
            {filteredItems.map((item) => {
              const status = statusConfig[item.status];
              const waitingLabel = formatDistanceToNow(new Date(item.allocationDate), { locale: ro, addSuffix: false });
              return (
                <li
                  key={item.id}
                  className="flex flex-col gap-3 rounded-lg border border-border bg-card/60 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-foreground">
                      <span>{item.employee}</span>
                      <Badge variant={status.variant} className="gap-1">
                        {status.icon ? <status.icon className="h-3.5 w-3.5" aria-hidden /> : null}
                        {status.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.equipment}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.location} • alocat acum {waitingLabel}
                    </p>
                  </div>
                  <Button
                    type="button"
                    className="gap-2 self-start sm:self-auto"
                    onClick={() => onGenerate(item)}
                    aria-label={`Generează PV pentru ${item.employee}`}
                  >
                    <FileText className="h-4 w-4" aria-hidden />
                    Generează PV
                  </Button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <EmptyState
          title="Nu există PV-uri în așteptare"
          description="Felicitări! Toate alocările recente au documentele generate."
        />
      )}
    </div>
  );
}