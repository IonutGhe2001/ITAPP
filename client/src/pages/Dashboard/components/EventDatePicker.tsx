import { useEffect, useMemo, useRef, useState } from 'react';
import { format } from 'date-fns';
import type { Locale } from 'date-fns';
import { ro } from 'date-fns/locale';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker, type MonthCaptionProps, useDayPicker } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const CalendarMonthCaption = ({ calendarMonth, className, ...divProps }: MonthCaptionProps) => {
  const { goToMonth, previousMonth, nextMonth, labels, dayPickerProps } = useDayPicker();
  const locale = (dayPickerProps.locale as Locale | undefined) ?? ro;
  const isNavigationDisabled = Boolean(dayPickerProps.disableNavigation);
  const monthLabel = format(calendarMonth.date, 'MMMM yyyy', { locale });

  return (
    <div {...divProps} className={cn('text-foreground flex items-center gap-2 px-1', className)}>
      <button
        type="button"
        onClick={() => {
          if (!isNavigationDisabled && previousMonth) {
            goToMonth(previousMonth);
          }
        }}
        disabled={isNavigationDisabled || !previousMonth}
        aria-label={previousMonth ? labels.labelPrevious(previousMonth) : undefined}
        className="border-border/70 text-muted-foreground hover:bg-muted/60 focus-visible:ring-ring inline-flex h-8 w-8 items-center justify-center rounded-lg border bg-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
      </button>
      <span
        className="flex-1 text-center text-sm font-semibold capitalize"
        role="status"
        aria-live="polite"
      >
        {monthLabel}
      </span>
      <button
        type="button"
        onClick={() => {
          if (!isNavigationDisabled && nextMonth) {
            goToMonth(nextMonth);
          }
        }}
        disabled={isNavigationDisabled || !nextMonth}
        aria-label={nextMonth ? labels.labelNext(nextMonth) : undefined}
        className="border-border/70 text-muted-foreground hover:bg-muted/60 focus-visible:ring-ring inline-flex h-8 w-8 items-center justify-center rounded-lg border bg-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronRight className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
};

interface EventDatePickerProps {
  selected?: Date;
  onSelect: (date: Date) => void;
  locale?: Locale;
  placeholder?: string;
  formatSelectedLabel?: (date: Date) => string;
  disabled?: boolean;
  className?: string;
}

export function EventDatePicker({
  selected,
  onSelect,
  locale,
  placeholder = 'Select date',
  formatSelectedLabel,
  disabled,
  className,
}: EventDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const resolvedLocale = locale ?? ro;
  const localeWithWeekStart = useMemo(() => {
    return {
      ...resolvedLocale,
      options: {
        ...resolvedLocale.options,
        weekStartsOn: 1,
      },
    } satisfies Locale;
  }, [resolvedLocale]);

  const label = useMemo(() => {
    if (selected) {
      if (formatSelectedLabel) {
        return formatSelectedLabel(selected);
      }
      return format(selected, 'PPP', { locale: resolvedLocale });
    }
    return placeholder;
  }, [formatSelectedLabel, placeholder, resolvedLocale, selected]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (disabled) {
      setIsOpen(false);
    }
  }, [disabled]);

  const handleSelect = (day?: Date) => {
    if (!day) {
      return;
    }

    onSelect(day);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <Button
        type="button"
        variant="outline"
        className={cn(
          'w-full justify-between gap-2 text-left font-normal',
          !selected && 'text-muted-foreground'
        )}
        onClick={() => setIsOpen((state) => !state)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        disabled={disabled}
      >
        <span className="line-clamp-1 flex-1 text-sm">{label}</span>
        <CalendarDays className="text-muted-foreground h-4 w-4" aria-hidden />
      </Button>
      {isOpen ? (
        <div className="border-border bg-popover text-popover-foreground absolute left-0 right-0 z-50 mt-2 rounded-xl border p-3 shadow-lg">
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={handleSelect}
            defaultMonth={selected ?? new Date()}
            showOutsideDays
            locale={localeWithWeekStart}
            components={{
              MonthCaption: CalendarMonthCaption,
            }}
            className="mx-auto"
            classNames={{
              months: 'flex flex-col space-y-4',
              month: 'space-y-4',
              month_caption: 'px-1',
              caption_label: 'sr-only',
              nav: 'hidden',
              month_grid: 'w-full table-fixed border-collapse',
              weekdays: '',
              weekday: 'text-center text-xs font-medium uppercase tracking-wide',
              weeks: '',
              week: '',
              day: 'p-0 text-center align-middle',
              day_button:
                'inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              selected: 'bg-primary text-primary-foreground hover:bg-primary/90',
              today: 'text-primary font-semibold',
              outside: 'text-muted-foreground/50',
              disabled: 'text-muted-foreground/40',
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
