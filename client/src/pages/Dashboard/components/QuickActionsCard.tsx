import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import { QuickActions } from './QuickActions';

interface QuickActionsCardProps {
  className?: string;
}

export function QuickActionsCard({ className }: QuickActionsCardProps) {
  return (
    <Card className={cn('h-auto self-start border border-border/80 bg-card/90 shadow-sm', className)}>
      <CardHeader className="border-b border-border/60 pb-4">
        <CardTitle className="text-lg font-semibold text-foreground">Acțiuni rapide</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <QuickActions />
      </CardContent>
    </Card>
  );
}