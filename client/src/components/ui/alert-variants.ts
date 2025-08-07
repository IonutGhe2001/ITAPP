import { cva } from 'class-variance-authority';

export const alertVariants = cva('flex items-center gap-2 rounded-md border p-3 text-sm', {
  variants: {
    variant: {
      info: 'border-blue-200 bg-blue-50 text-blue-700',
      warning: 'border-yellow-300 bg-yellow-50 text-yellow-800',
      destructive: 'border-destructive/50 bg-destructive/10 text-destructive',
    },
  },
  defaultVariants: {
    variant: 'info',
  },
});