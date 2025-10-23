import type { JSX } from 'react';
import {
  LaptopIcon,
  SmartphoneIcon,
  NetworkIcon,
  MonitorIcon,
  MouseIcon,
  KeyboardIcon,
  PrinterIcon,
  ServerIcon,
  WrenchIcon,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  laptop: LaptopIcon,
  telefon: SmartphoneIcon,
  sim: NetworkIcon,
  monitor: MonitorIcon,
  pc: MonitorIcon,
  server: ServerIcon,
  router: NetworkIcon,
  mouse: MouseIcon,
  tastatura: KeyboardIcon,
  imprimanta: PrinterIcon,
};

export interface EquipmentIconProps {
  type?: string | null;
  className?: string;
}

export function EquipmentIcon({
  type,
  className = 'w-4 h-4 text-primary',
}: EquipmentIconProps): JSX.Element {
  const normalizedType = typeof type === 'string' ? type.trim().toLowerCase() : undefined;
  const Icon = normalizedType ? iconMap[normalizedType] : undefined;

  if (Icon) {
    return <Icon className={className} />;
  }
  
  return <WrenchIcon className={className} />;
}
