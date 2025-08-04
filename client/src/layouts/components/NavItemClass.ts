import { cva } from 'class-variance-authority';

export const navItemClass = cva(
  'group flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium',
  {
    variants: {
      active: {
        true: 'bg-primary/10 text-primary',
        false: 'text-muted-foreground hover:bg-muted',
      },
    },
    defaultVariants: {
      active: false,
    },
  }
);

export type NavItemClassProps = {
  active?: boolean;
};
