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
  ProjectorIcon,
  TvIcon,
  CableIcon,
  UsbIcon,
  HeadphonesIcon,
  PackageIcon,
} from 'lucide-react';

// Icon mapping for equipment types
// Includes both Romanian and English terms for flexibility
// Duplicate entries (e.g., 'tastatura' and 'keyboard') support bilingual usage
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  laptop: LaptopIcon,
  telefon: SmartphoneIcon,
  sim: NetworkIcon,
  monitor: MonitorIcon,
  pc: MonitorIcon,
  server: ServerIcon,
  router: NetworkIcon,
  mouse: MouseIcon,
  keyboard: KeyboardIcon, // Duplicate for English support
  tastatura: KeyboardIcon,
  imprimanta: PrinterIcon,
  videoproiector: ProjectorIcon,
  projector: ProjectorIcon,
  tv: TvIcon,
  // IT consumables
  charger: CableIcon,
  incarcator: CableIcon,
  cable: CableIcon,
  cablu: CableIcon,
  adapter: UsbIcon,
  adaptor: UsbIcon,
  headset: HeadphonesIcon,
  casti: HeadphonesIcon,
  webcam: MonitorIcon,
  consumabil: PackageIcon,
  consumable: PackageIcon,
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
