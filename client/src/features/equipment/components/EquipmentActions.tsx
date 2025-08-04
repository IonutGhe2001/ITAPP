import { PencilIcon, TrashIcon } from 'lucide-react';
import type { EquipmentActionsProps } from '@/features/equipment/types';

export default function EquipmentActions({
  echipament,
  onEdit,
  onDelete,
  onAllocate,
  onRecupereaza,
}: EquipmentActionsProps) {
  return (
    <>
      {echipament.stare === 'in_stoc' ? (
        <button
          onClick={onAllocate}
          className="text-xs text-blue-600 hover:underline"
          title="Alocă echipamentul"
        >
          Alocă
        </button>
      ) : (
        <button
          onClick={onRecupereaza}
          className="text-xs text-red-600 hover:underline"
          title="Recuperează echipamentul"
        >
          Recuperează
        </button>
      )}

      {echipament.stare === 'mentenanta' ? (
        <button
          onClick={() => onEdit?.({ ...echipament, stare: 'in_stoc' })}
          className="text-xs text-blue-600 hover:underline"
          title="Marchează în stoc"
        >
          În stoc
        </button>
      ) : (
        <button
          onClick={() => onEdit?.({ ...echipament, stare: 'mentenanta' })}
          className="text-xs text-yellow-600 hover:underline"
          title="Trimite în mentenanță"
        >
          Mentenanță
        </button>
      )}

      <div className="flex gap-2">
        <button onClick={() => onEdit?.({ ...echipament, __editMode: true })} title="Editează">
          <PencilIcon className="text-primary hover:text-primary-dark h-4 w-4" />
        </button>
        <button onClick={() => onDelete?.(echipament.id)}>
          <TrashIcon className="text-primary hover:text-primary-dark h-4 w-4" />
        </button>
      </div>
    </>
  );
}