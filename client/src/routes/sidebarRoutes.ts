import { Home, Laptop, Users, UserCircle } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export interface SidebarRoute {
  path: string;
  label: string;
  icon: React.ElementType; // aici, nu JSX.Element!
}

export const sidebarRoutes: SidebarRoute[] = [
  { path: ROUTES.DASHBOARD, label: 'Dashboard', icon: Home },
  { path: ROUTES.EQUIPMENT, label: 'Echipamente', icon: Laptop },
  { path: ROUTES.COLEGI, label: 'Colegi', icon: Users },
  { path: ROUTES.PROFILE, label: 'Profil', icon: UserCircle },
];
