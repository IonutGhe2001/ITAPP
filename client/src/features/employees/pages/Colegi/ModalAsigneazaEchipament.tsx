import { useState } from 'react';
import { useEchipamente, useUpdateEchipament } from '@/features/equipment';
import type { Echipament } from '@/features/equipment/types';
import { genereazaProcesVerbal, type ProcesVerbalTip } from '@/features/proceseVerbale';
import { queueProcesVerbal } from '@/features/proceseVerbale/pvQueue';
import { getConfig } from '@/services/configService';
import { useToast } from '@/hooks/use-toast/use-toast-hook';
import { handleApiError } from '@/utils/apiError';

export default function ModalAsigneazaEchipament({
  angajatId,
  onClose,
  onSuccess,
  filterTip,
  oldEchipamentId,
  onReplace,
  onPendingPV,
}: {
  angajatId: string;
  onClose: () => void;
  onSuccess?: () => void;
  filterTip?: string;
  oldEchipamentId?: string;
  onReplace?: (oldId: string, newId: string) => Promise<void> | void;
  onPendingPV?: (data: { predate?: string[]; primite?: string[] }) => void;
}) {
  const { data: echipamente = [] } = useEchipamente();
  const updateMutation = useUpdateEchipament();
  const { toast } = useToast();
  const [selectedId, setSelectedId] = useState('');
  const filterTipNormalized = filterTip?.trim().toLowerCase();

  const handleAssign = async () => {
    if (!selectedId) return;

    const tip: ProcesVerbalTip = onReplace && oldEchipamentId ? 'SCHIMB' : 'PREDARE_PRIMIRE';

    try {
      if (onReplace && oldEchipamentId) {
        await onReplace(oldEchipamentId, selectedId);
        onPendingPV?.({ predate: [oldEchipamentId], primite: [selectedId] });
        toast({
          title: 'Echipament schimbat',
          description: 'Proces verbal în așteptare',
        });
      } else {
        await updateMutation.mutateAsync({
          id: selectedId,
          data: { angajatId, stare: 'alocat' },
        });
        onPendingPV?.({ primite: [selectedId] });
        toast({
          title: 'Echipament asignat',
          description: 'Proces verbal în așteptare',
        });
      }

      const { pvGenerationMode } = await getConfig();
      if (pvGenerationMode === 'auto') {
        const url = await genereazaProcesVerbal(
          angajatId,
          tip,
          tip === 'SCHIMB' && oldEchipamentId
            ? { predate: [oldEchipamentId], primite: [selectedId] }
            : { primite: [selectedId] }
        );
        window.open(url, '_blank');
        toast({ title: 'Proces verbal generat' });
      } else {
        queueProcesVerbal(
          angajatId,
          tip,
          tip === 'SCHIMB' && oldEchipamentId
            ? { predate: [oldEchipamentId], primite: [selectedId] }
            : { primite: [selectedId] }
        );
        toast({ title: 'Proces verbal în așteptare' });
      }

      onClose();
      onSuccess?.();
    } catch (err) {
      toast({
        title: 'Eroare la asignare',
        description: handleApiError(err),
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card relative w-full max-w-md space-y-4 rounded-2xl p-6 shadow-xl">
        <h2 className="text-primary text-lg font-semibold">Asignează echipament</h2>

        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="border-border bg-background text-foreground w-full rounded-lg border px-4 py-2"
        >
          <option value="">Selectează echipament în stoc</option>
          {echipamente
           .filter(
              (e: Echipament) =>
                e.stare === 'in_stoc' &&
                (!filterTipNormalized || e.tip.trim().toLowerCase() === filterTipNormalized)
            )
            .map((e: Echipament) => (
              <option key={e.id} value={e.id}>
                {e.nume} – Serie: {e.serie}
              </option>
            ))}
        </select>

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
            disabled={!selectedId}
          >
            Asignează
          </button>
        </div>
      </div>
    </div>
  );
}
