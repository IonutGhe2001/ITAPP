import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import { QuickActions } from './QuickActions';

interface QuickActionsCompactProps {
  className?: string;
}

export function QuickActionsCompact({ className }: QuickActionsCompactProps) {
  return (
    <Card className={cn('flex min-h-[520px] flex-col border border-border/80 bg-card/90 shadow-sm', className)}>
      <CardHeader className="flex items-center justify-between gap-3 space-y-0 border-b border-border/60 p-4">
        <CardTitle className="text-base font-semibold text-foreground sm:text-lg">Acțiuni rapide</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-4 p-4">
        <QuickActions />
      </CardContent>
    </Card>
  );
}