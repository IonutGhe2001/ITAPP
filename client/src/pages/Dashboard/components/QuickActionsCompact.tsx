import { forwardRef } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import { QuickActions } from './QuickActions';

interface QuickActionsCompactProps {
  className?: string;
}

export const QuickActionsCompact = forwardRef<HTMLDivElement, QuickActionsCompactProps>(
  ({ className }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn('flex flex-col border border-border/80 bg-card/90 shadow-sm', className)}
      >
        <CardHeader className="flex items-center justify-between gap-3 space-y-0 border-b border-border/60 p-4">
          <CardTitle className="text-base font-semibold text-foreground sm:text-lg">Acțiuni rapide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-4">
          <QuickActions />
        </CardContent>
      </Card>
    );
  }
);

QuickActionsCompact.displayName = 'QuickActionsCompact';