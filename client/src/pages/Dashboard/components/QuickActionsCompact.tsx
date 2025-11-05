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
        className={cn('border-border/80 bg-card/90 flex flex-col border shadow-sm', className)}
      >
        <CardHeader className="border-border/60 flex items-center justify-between gap-3 space-y-0 border-b p-4">
          <CardTitle className="text-foreground text-base font-semibold sm:text-lg">
            Acțiuni rapide
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-4">
          <QuickActions />
        </CardContent>
      </Card>
    );
  }
);

QuickActionsCompact.displayName = 'QuickActionsCompact';
