import { addDays, addWeeks, addMonths, differenceInCalendarDays, startOfDay } from 'date-fns';
import type { Eveniment } from '@/features/events';

export function occursOn(event: Eveniment, day: Date) {
  const eventDate = startOfDay(new Date(event.data));
  const target = startOfDay(day);
  if (target < eventDate) return false;
  switch (event.recurrence) {
    case 'daily':
      return true;
    case 'weekly':
      return differenceInCalendarDays(target, eventDate) % 7 === 0;
    case 'monthly':
      return eventDate.getDate() === target.getDate();
    default:
      return eventDate.getTime() === target.getTime();
  }
}

export function computeHighlightDates(events: Eveniment[]) {
  const today = startOfDay(new Date());
  const end = addMonths(today, 3);
  const dates: Date[] = [];
  events.forEach((e) => {
    let current = startOfDay(new Date(e.data));
    while (current <= end) {
      dates.push(current);
      switch (e.recurrence) {
        case 'daily':
          current = addDays(current, 1);
          break;
        case 'weekly':
          current = addWeeks(current, 1);
          break;
        case 'monthly':
          current = addMonths(current, 1);
          break;
        default:
          current = addMonths(end, 1);
          break;
      }
    }
  });
  return dates;
}
