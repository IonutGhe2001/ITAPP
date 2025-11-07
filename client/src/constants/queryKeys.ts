export const QUERY_KEYS = {
  EQUIPMENT: ['echipamente'] as const,
  EMPLOYEES: ['angajati'] as const,
  DEPARTMENT_CONFIGS: ['department-configs'] as const,
  PURCHASE_REQUESTS: ['purchase-requests'] as const,
  EVENTS: ['evenimente'] as const,
  GLOBAL_SEARCH: ['global-search'] as const,
  SEARCH_SUGGESTIONS: ['search-suggestions'] as const,
  OVERVIEW_STATS: ['overview-stats'] as const,
  ONBOARDING_PACKAGES: ['onboarding', 'packages'] as const,
} as const;

export type QueryKeys = typeof QUERY_KEYS;