"use client";

import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export default function UpcomingEvents() {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-pink-600 flex items-center gap-2">
        📅 Evenimente viitoare
      </h2>
      <div className="rounded-3xl border-0 bg-white/80 backdrop-blur-lg shadow-xl overflow-hidden p-4">
        <DayPicker
          mode="single"
          selected={undefined}
          onSelect={() => {}}
          className="p-2 [&_.rdp-day_selected]:bg-pink-500 [&_.rdp-day_selected]:text-white [&_.rdp-day]:rounded-full [&_.rdp-day]:transition-all [&_.rdp-day:hover]:bg-pink-100"
        />
      </div>
    </section>
  );
}
