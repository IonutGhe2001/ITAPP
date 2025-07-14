import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

type EventCalendarProps = {
  selected: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  highlightDates?: Date[];
};

export default function EventCalendar({
  selected,
  onSelect,
  highlightDates = [],
}: EventCalendarProps) {
  const normalizeDate = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const modifiers = {
    hasEvent: highlightDates.map(normalizeDate),
  };

  const modifiersClassNames = {
    hasEvent: "has-event",
  };

  return (
    <div className="rounded-xl border border-border bg-background shadow-sm p-4 sm:p-6 w-full">
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={onSelect}
        modifiers={modifiers}
        modifiersClassNames={modifiersClassNames}
        showOutsideDays
      />
    </div>
  );
}