import { memo } from 'react';
import { Search } from 'lucide-react';
import Toolbar from '@/components/Toolbar';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { EquipmentFilterProps, EquipmentSortOption } from '@/features/equipment/types';
import { EQUIPMENT_STATUS, EQUIPMENT_STATUS_LABELS } from '@/features/equipment/types';

const EMPTY_OPTION_VALUE = 'all';

const STATUS_OPTIONS = [
  { value: EMPTY_OPTION_VALUE, label: 'Toate statusurile' },
  { value: EQUIPMENT_STATUS.ALOCAT, label: EQUIPMENT_STATUS_LABELS[EQUIPMENT_STATUS.ALOCAT] },
  { value: EQUIPMENT_STATUS.IN_STOC, label: 'Disponibile' },
  { value: EQUIPMENT_STATUS.MENTENANTA, label: 'În service' },
];

const SORT_OPTIONS = [
  { value: 'name-asc', label: 'Nume A–Z' },
  { value: 'assigned-date', label: 'Dată asignare' },
  { value: 'status', label: 'Status' },
];

const formatTypeLabel = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return 'Necunoscut';
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
};

function EquipmentFilter({
  search,
  status,
  type,
  sort,
  types,
  onSearchChange,
  onStatusChange,
  onTypeChange,
  onSortChange,
}: EquipmentFilterProps) {
  return (
    <Toolbar>
      <div className="flex min-w-[220px] flex-1 items-center gap-3">
        <div className="relative w-full">
          <Search
            className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
            aria-hidden="true"
          />
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Caută după nume, serie sau tip"
            className="focus-visible:ring-primary h-11 rounded-xl border border-slate-200/80 bg-white/90 pl-9 text-sm shadow-sm transition focus-visible:ring-2 dark:border-slate-700/70 dark:bg-slate-900/70"
            aria-label="Caută echipamente"
          />
        </div>
      </div>

      <div className="min-w-[180px]">
        <Select
          value={type || EMPTY_OPTION_VALUE}
          onValueChange={(value) => onTypeChange(value === EMPTY_OPTION_VALUE ? '' : value)}
        >
          <SelectTrigger className="h-11 rounded-xl border border-slate-200/80 bg-white/90 text-sm shadow-sm dark:border-slate-700/70 dark:bg-slate-900/70">
            <SelectValue placeholder="Tip echipament" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value={EMPTY_OPTION_VALUE}>Toate tipurile</SelectItem>
            {types.map((option) => (
              <SelectItem key={option} value={option}>
                {formatTypeLabel(option)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-[180px]">
        <Select
          value={status || EMPTY_OPTION_VALUE}
          onValueChange={(value) => onStatusChange(value === EMPTY_OPTION_VALUE ? '' : value)}
        >
          <SelectTrigger className="h-11 rounded-xl border border-slate-200/80 bg-white/90 text-sm shadow-sm dark:border-slate-700/70 dark:bg-slate-900/70">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-[180px]">
        <Select value={sort} onValueChange={(value) => onSortChange(value as EquipmentSortOption)}>
          <SelectTrigger className="h-11 rounded-xl border border-slate-200/80 bg-white/90 text-sm shadow-sm dark:border-slate-700/70 dark:bg-slate-900/70">
            <SelectValue placeholder="Sortare" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Toolbar>
  );
}

export default memo(EquipmentFilter);
