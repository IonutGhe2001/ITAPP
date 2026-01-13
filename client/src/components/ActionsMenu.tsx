import type { ButtonHTMLAttributes } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ActionsMenuProps {
  srLabel: string;
  align?: 'start' | 'center' | 'end';
  triggerClassName?: string;
  children: React.ReactNode;
  triggerProps?: ButtonHTMLAttributes<HTMLButtonElement>;
}

export default function ActionsMenu({
  srLabel,
  align = 'end',
  triggerClassName,
  triggerProps,
  children,
}: ActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={srLabel}
          className={cn(
            'focus-visible:ring-primary inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200/70 bg-white text-slate-600 shadow-sm transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800',
            triggerClassName
          )}
          {...triggerProps}
        >
          <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-48 p-1">
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
