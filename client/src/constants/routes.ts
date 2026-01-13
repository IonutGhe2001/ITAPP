export const ROUTES = {
  DASHBOARD: '/',
  LOGIN: '/login',
  EQUIPMENT: '/echipamente',
  EQUIPMENT_DETAIL: '/echipamente/:id',
  COLEGI: '/colegi',
  EMPLOYEE_FORM: '/employee-form',
  PROFILE: '/profil',
  SEARCH: '/search',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
