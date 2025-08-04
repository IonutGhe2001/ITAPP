import { memo } from 'react';
import { Button } from '@/components/ui/button';

interface EquipmentTypeFilterProps {
  types: string[];
  selected: string;
  onChange: (type: string) => void;
}

function EquipmentTypeFilter({ types, selected, onChange }: EquipmentTypeFilterProps) {
  if (!types.length) return null;

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      <Button
        variant={selected === '' ? 'default' : 'outline'}
        onClick={() => onChange('')}
        className="text-sm capitalize"
      >
        Toate
      </Button>
      {types.map((t) => (
        <Button
          key={t}
          variant={selected === t ? 'default' : 'outline'}
          onClick={() => onChange(t)}
          className="text-sm capitalize"
        >
          {t}
        </Button>
      ))}
    </div>
  );
}

export default memo(EquipmentTypeFilter);
