import { useMemo, useState } from 'react';
import { useEchipamente, useUpdateEchipament } from '@/features/equipment';
import type { Echipament } from '@/features/equipment/types';
import { type ProcesVerbalTip } from '@/features/proceseVerbale';
import { queueProcesVerbal } from '@/features/proceseVerbale/pvQueue';
import { useToast } from '@/hooks/use-toast/use-toast-hook';
import { handleApiError } from '@/utils/apiError';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function ModalAsigneazaEchipament({
  angajatId,
  onClose,
  onSuccess,
  filterTip,
  oldEchipamentIds,
  onReplace,
  onPendingPV,
}: {
  angajatId: string;
  onClose: () => void;
  onSuccess?: (result: {
    assignedEquipment?: Echipament[];
    payload?: { predate?: string[]; primite?: string[] };
  }) => void;
  filterTip?: string;
  oldEchipamentIds?: string[];
  onReplace?: (oldIds: string[], newIds: string[]) => Promise<void> | void;
  onPendingPV?: (data: { predate?: string[]; primite?: string[] }) => void;
}) {
  const { data: echipamente = [] } = useEchipamente();
  const updateMutation = useUpdateEchipament();
  const { toast } = useToast();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const filterTipNormalized = filterTip?.trim().toLowerCase();
  const replaceIds = (oldEchipamentIds ?? []).filter((id): id is string => Boolean(id));
  const replaceLimit = replaceIds.length;
  const isReplacing = Boolean(onReplace && replaceLimit > 0);

  const availableEquipment = useMemo(
    () =>
      echipamente.filter(
        (e: Echipament) =>
          e.stare === 'in_stoc' &&
          (!filterTipNormalized || e.tip.trim().toLowerCase() === filterTipNormalized)
      ),
    [echipamente, filterTipNormalized]
  );

  const filteredEquipment = useMemo(() => {
    if (!searchQuery.trim()) return availableEquipment;
    const query = searchQuery.trim().toLowerCase();
    return availableEquipment.filter(
      (e: Echipament) =>
        e.nume.toLowerCase().includes(query) ||
        e.serie.toLowerCase().includes(query) ||
        e.tip.toLowerCase().includes(query)
    );
  }, [availableEquipment, searchQuery]);

  const handleToggle = (id: string) => {
    setSelectedIds((prev) => {
      if (isReplacing) {
        if (prev.includes(id)) {
          return prev.filter((item) => item !== id);
        }
        if (replaceLimit > 0 && prev.length >= replaceLimit) {
          return prev;
        }
        return [...prev, id];
      }
      return prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
    });
  };

  const handleAssign = async () => {
    if (!selectedIds.length) return;

    if (isReplacing && replaceLimit > 0 && selectedIds.length !== replaceLimit) {
      return;
    }

    const tip: ProcesVerbalTip = isReplacing ? 'SCHIMB' : 'PREDARE_PRIMIRE';
    let payload: { predate?: string[]; primite?: string[] } | undefined;
    const selectedSnapshot = [...selectedIds];

    try {
      if (isReplacing && onReplace) {
        await onReplace(replaceIds, selectedSnapshot);
        payload = { predate: replaceIds, primite: selectedSnapshot };
        onPendingPV?.(payload);
      } else {
        const idsToAssign = [...selectedSnapshot];
        for (const id of idsToAssign) {
          await updateMutation.mutateAsync({
            id,
            data: { angajatId, stare: 'alocat' },
          });
        }
        payload = { primite: idsToAssign };
        onPendingPV?.(payload);
      }

      queueProcesVerbal(
        angajatId,
        tip,
        payload
      );
      
      const assignedEquipment = selectedSnapshot
        .map((id) => echipamente.find((e: Echipament) => e.id === id))
        .filter((item): item is Echipament => Boolean(item))
        .map((item) => ({
          ...item,
          angajatId,
          stare: 'alocat' as const,
        }));

      onSuccess?.({
        assignedEquipment,
        payload,
      });

      setSelectedIds([]);
      onClose();
    } catch (err) {
      toast({
        title: 'Eroare la asignare',
        description: handleApiError(err),
        variant: 'destructive',
      });
    }
  };

  const assignButtonLabel = isReplacing
    ? replaceLimit > 1
      ? `Înlocuiește ${replaceLimit} echipamente`
      : 'Înlocuiește'
    : selectedIds.length > 1
      ? `Asignează ${selectedIds.length} echipamente`
      : 'Asignează';

      const canSubmit = isReplacing
    ? replaceLimit === 0 || selectedIds.length === replaceLimit
    : selectedIds.length > 0;

  const selectionType = isReplacing && replaceLimit === 1 ? 'radio' : 'checkbox';
  const reachedReplaceLimit = isReplacing && replaceLimit > 0 && selectedIds.length >= replaceLimit;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card relative w-full max-w-md space-y-4 rounded-2xl p-6 shadow-xl">
        <h2 className="text-primary text-lg font-semibold">Asignează echipament</h2>

        <p className="text-muted-foreground text-sm">
          {isReplacing
            ? replaceLimit > 1
              ? `Selectează ${replaceLimit} echipamente din stoc pentru înlocuire.`
              : 'Selectează echipamentul care va înlocui dispozitivul existent.'
            : 'Selectează unul sau mai multe echipamente disponibile pentru a le asigna.'}
        </p>

        <div className="relative">
          <Search
            className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
            aria-hidden="true"
          />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Caută după nume, serie sau tip..."
            className="pl-10"
          />
        </div>

        <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
          {filteredEquipment.length ? (
            filteredEquipment.map((e: Echipament) => {
              const isSelected = selectedIds.includes(e.id);
              return (
                <label
                  key={e.id}
                  className="border-border flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 text-sm shadow-sm transition hover:border-primary/60"
                >
                  <input
                    type={selectionType}
                    name="equipment-selection"
                    value={e.id}
                    checked={isSelected}
                    onChange={() => handleToggle(e.id)}
                    className="h-4 w-4"
                    disabled={isReplacing && reachedReplaceLimit && !isSelected}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">{e.nume}</span>
                    <span className="text-muted-foreground text-xs">Serie: {e.serie}</span>
                    <span className="text-muted-foreground text-xs">Tip: {e.tip}</span>
                  </div>
                </label>
              );
            })
          ) : (
            <div className="text-muted-foreground text-sm">
              {searchQuery.trim()
                ? 'Nu există echipamente care să corespundă căutării.'
                : 'Nu există echipamente disponibile în stoc pentru criteriile selectate.'}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="bg-muted text-muted-foreground hover:bg-muted/90 rounded-lg px-4 py-2"
          >
            Anulează
          </button>
          <button
            onClick={handleAssign}
            className="bg-primary text-primary-foreground hover:bg-primary-dark rounded-lg px-4 py-2"
            disabled={!canSubmit}
          >
            {assignButtonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
