import { AlertTriangle, Bell, ShieldAlert } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ro } from 'date-fns/locale';
import type { Alert } from '../api';

const severityConfig: Record<Alert['severity'], { label: string; icon: typeof AlertTriangle; className: string }> = {
  critical: {
    label: 'Prioritate critică'
    icon: ShieldAlert,
    className: 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300',
  },
  warning: {
    label: 'Avertizare',
    icon: AlertTriangle,
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
  },
  info: {
    label: 'Informare',
    icon: Bell,
    className: 'bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300',
  },
};

interface AlertItemProps {
  alert: Alert;
}

export function AlertItem({ alert }: AlertItemProps) {
  const config = severityConfig[alert.severity];
  const Icon = config.icon;
  const timestampLabel = formatDistanceToNow(new Date(alert.timestamp), {
    locale: ro,
    addSuffix: true,
  });

  return (
    <article className="flex gap-3 rounded-lg border border-border bg-card/60 p-4 shadow-none">
      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${config.className}`} aria-hidden>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-foreground">{alert.title}</h3>
          <span className="text-xs text-muted-foreground">{timestampLabel}</span>
        </div>
        <p className="text-sm text-muted-foreground">{alert.description}</p>
        <span className="sr-only">{config.label}</span>
      </div>
    </article>
  );
}