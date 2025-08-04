import { memo, useMemo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ro } from 'date-fns/locale';

type UpdateItemProps = {
  icon: React.ReactNode;
  message: string;
  timestamp: Date;
};

function UpdateItem({ icon, message, timestamp }: UpdateItemProps) {
  const formatted = useMemo(
    () =>
      formatDistanceToNow(new Date(timestamp), {
        addSuffix: true,
        locale: ro,
      }),
    [timestamp]
  );
  return (
    <div className="border-border hover:bg-muted/50 flex items-start gap-4 rounded-lg border-b px-2 py-4 transition last:border-none">
      <div className="mt-1 text-xl">{icon}</div>
      <div className="flex flex-col">
        <p className="text-foreground text-sm">{message}</p>
        <span className="text-muted-foreground text-xs">{formatted}</span>
      </div>
    </div>
  );
}

export default memo(UpdateItem);
