import { Home, Laptop, Users } from "lucide-react";

export interface SidebarRoute {
  path: string;
  label: string;
  icon: React.ElementType;  // aici, nu JSX.Element!
}

export const sidebarRoutes: SidebarRoute[] = [
  { path: "/", label: "Dashboard", icon: Home },
  { path: "/echipamente", label: "Echipamente", icon: Laptop },
  { path: "/colegi", label: "Colegi", icon: Users },
];
