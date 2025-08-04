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

export function getEquipmentIcon(type: string, className = 'w-4 h-4 text-primary'): JSX.Element {
  const Icon = iconMap[type.toLowerCase()];
  if (Icon) {
    return <Icon className={className} />;
  }
  return <WrenchIcon className={className} />;
}
