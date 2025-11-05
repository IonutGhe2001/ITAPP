import { Fragment } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ro } from 'date-fns/locale';
import type { ActivityItem } from '../api';
import { EmptyState } from './EmptyState';

interface ActivityFeedProps {
  items: ActivityItem[];
  isLoading?: boolean;
}

const skeletonItems = Array.from({ length: 5 });

export function ActivityFeed({ items, isLoading }: ActivityFeedProps) {
  if (isLoading) {
    return (
      <ul className="space-y-3" aria-hidden>
        {skeletonItems.map((_, index) => (
          <li
            key={index}
            className="border-border bg-muted/30 animate-pulse rounded-lg border px-4 py-3"
          />
        ))}
      </ul>
    );
  }

  if (!items.length) {
    return (
      <EmptyState
        title="Nu există activitate recentă"
        description="Primele evenimente vor apărea aici."
      />
    );
  }

  return (
    <ol className="space-y-4" aria-live="polite">
      {items.map((item, index) => (
        <Fragment key={item.id}>
          <li className="flex items-start gap-3">
            <div className="bg-primary mt-1 h-2 w-2 flex-shrink-0 rounded-full" aria-hidden />
            <div className="space-y-1">
              <p className="text-foreground text-sm">
                <span className="font-medium">{item.actor}</span> {item.action}{' '}
                <span className="text-foreground/80 font-medium">{item.target}</span>
              </p>
              <p className="text-muted-foreground text-xs">
                {formatDistanceToNow(new Date(item.timestamp), { locale: ro, addSuffix: true })}
              </p>
            </div>
          </li>
          {index < items.length - 1 ? (
            <li aria-hidden>
              <div className="bg-border ml-1 h-5 w-px" />
            </li>
          ) : null}
        </Fragment>
      ))}
    </ol>
  );
}
