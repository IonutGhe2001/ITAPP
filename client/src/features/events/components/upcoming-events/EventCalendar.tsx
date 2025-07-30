import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { ro } from "date-fns/locale";

type EventCalendarProps = {
  selected: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  onDoubleClick?: (date: Date) => void;
  highlightDates?: Date[];
};

export default function EventCalendar({
  selected,
  onSelect,
  onDoubleClick,
  highlightDates = [],
}: EventCalendarProps) {
  const normalizeDate = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const modifiers = {
    hasEvent: highlightDates.map(normalizeDate),
  };

  const modifiersClassNames = {
    hasEvent:
      "rounded-full bg-chart-1 text-white font-semibold hover:bg-chart-1/90",
  };

  const handleDayClick = (
    date?: Date,
    _modifiers?: unknown,
    e?: React.MouseEvent
  ) => {
    if (!date) return;
    if (e?.detail === 2) {
      onDoubleClick?.(date);
    } else {
      onSelect?.(date);
    }
  };

  return (
    <div className="w-full min-w-[250px] sm:min-w-[350px] rounded-xl border border-border bg-card shadow-sm p-4 sm:p-6">
      <DayPicker
        mode="single"
        selected={selected}
        onDayClick={handleDayClick}
        modifiers={modifiers}
        modifiersClassNames={modifiersClassNames}
        showOutsideDays
        locale={{ ...ro, options: { weekStartsOn: 1 } }}
      />
    </div>
  );
}
