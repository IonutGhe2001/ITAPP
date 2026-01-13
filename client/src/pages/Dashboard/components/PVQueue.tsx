import { useMemo, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ro } from 'date-fns/locale';
import { AlertTriangle, FileText, Loader2 } from 'lucide-react';

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
  onGenerateAll?: (items: PvQueueItem[]) => void;
  generatingId?: string | null;
  isBulkGenerating?: boolean;
  className?: string;
}

const skeletonItems = Array.from({ length: 4 });

const statusConfig: Record<
  PvQueueItem['status'],
  { label: string; variant: 'default' | 'secondary'; icon?: typeof AlertTriangle }
> = {
  pending: { label: 'În așteptare', variant: 'secondary' },
  overdue: { label: 'Întârziat', variant: 'default', icon: AlertTriangle },
};

export function PvQueue({
  items,
  isLoading,
  onGenerate,
  onGenerateAll,
  generatingId,
  isBulkGenerating,
  className,
}: PvQueueProps) {
  const [search, setSearch] = useState('');

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;
    return items.filter((item) =>
      [item.employee, item.equipment, item.location].some((value) =>
        value.toLowerCase().includes(query)
      )
    );
  }, [items, search]);

  return (
    <div className={cn('flex h-full min-h-0 flex-col gap-4', className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-foreground text-sm font-semibold">Proces-verbal în așteptare</p>
          <p className="text-muted-foreground text-xs">
            Gestionează rapid documentele de predare pentru echipamentele recent alocate.
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
          <SearchInput
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Caută după coleg sau echipament"
            aria-label="Caută în lista de PV"
            className="w-full sm:w-64"
          />
          {onGenerateAll ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => (onGenerateAll ? void onGenerateAll(filteredItems) : undefined)}
              disabled={isBulkGenerating || filteredItems.length === 0}
              className="whitespace-nowrap"
            >
              {isBulkGenerating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <FileText className="mr-2 h-4 w-4" aria-hidden />
              )}
              Generează toate
            </Button>
          ) : null}
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 space-y-3" aria-hidden>
          {skeletonItems.map((_, index) => (
            <div
              key={index}
              className="border-border bg-muted/30 h-[84px] animate-pulse rounded-lg border"
            />
          ))}
        </div>
      ) : filteredItems.length ? (
        <div className="min-h-0 flex-1">
          <ul className="flex h-full flex-col gap-3 overflow-y-auto pr-1" aria-live="polite">
            {filteredItems.map((item) => {
              const status = statusConfig[item.status];
              const waitingLabel = formatDistanceToNow(new Date(item.allocationDate), {
                locale: ro,
                addSuffix: false,
              });
              return (
                <li
                  key={item.id}
                  className="border-border bg-card/60 flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-2">
                    <div className="text-foreground flex flex-wrap items-center gap-2 text-sm font-semibold">
                      <span>{item.employee}</span>
                      <Badge variant={status.variant} className="gap-1">
                        {status.icon ? <status.icon className="h-3.5 w-3.5" aria-hidden /> : null}
                        {status.label}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">{item.equipment}</p>
                    <p className="text-muted-foreground text-xs">
                      {item.location} • alocat acum {waitingLabel}
                    </p>
                  </div>
                  <Button
                    type="button"
                    className="gap-2 self-start sm:self-auto"
                    onClick={() => void onGenerate(item)}
                    aria-label={`Generează PV pentru ${item.employee}`}
                    disabled={isBulkGenerating || generatingId === item.id}
                  >
                    {generatingId === item.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    ) : (
                      <FileText className="h-4 w-4" aria-hidden />
                    )}
                    {generatingId === item.id ? 'Se generează…' : 'Generează PV'}
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
