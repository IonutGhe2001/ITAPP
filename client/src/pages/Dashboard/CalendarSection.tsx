import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export default function CalendarSection() {
  return (
    <section aria-labelledby="calendar-heading">
      <h2 id="calendar-heading" className="text-sm font-semibold text-primary mb-4">
        Calendar
      </h2>
      <div className="rounded-xl border border-primary/20 bg-white overflow-hidden">
        <DayPicker
          mode="single"
          selected={undefined}
          onSelect={() => {}}
          className="p-4 [&_.rdp-day_selected]:bg-primary [&_.rdp-day_selected]:text-white [&_.rdp-day]:rounded-md [&_.rdp-day]:transition [&_.rdp-day:hover]:bg-primary/10"
        />
      </div>
    </section>
  );
}