import { cva } from 'class-variance-authority';

export const navItemClass = cva(
  'group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
  {
    variants: {
      active: {
        true: 'bg-gradient-to-r from-primary/20 via-primary/10 to-transparent text-foreground shadow-sm ring-1 ring-primary/20 before:absolute before:-left-3 before:top-1/2 before:h-10 before:w-1 before:-translate-y-1/2 before:rounded-full before:bg-primary before:content-[""]',
        false: 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
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
