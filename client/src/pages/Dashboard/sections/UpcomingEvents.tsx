"use client";

import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import {
  fetchEvenimente,
  createEveniment,
  deleteEveniment,
  updateEveniment,
} from "@/services/evenimenteService";
import { useAuth } from "@/store/authStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function UpcomingEvents() {
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [evenimente, setEvenimente] = useState<any[]>([]);
  const [titlu, setTitlu] = useState("");
  const [ora, setOra] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitlu, setEditTitlu] = useState("");
  const [editOra, setEditOra] = useState("");
  const [editData, setEditData] = useState<Date | null>(null);
  const token = useAuth((state) => state.token);

  useEffect(() => {
    if (token) {
      fetchEvenimente(token)
        .then(setEvenimente)
        .catch(console.error);
    }
  }, [token]);

  function handleDaySelect(day: Date) {
    setSelectedDay(day);
    setShowForm(false);
  }

  async function handleSubmit() {
    if (titlu.trim() === "" || ora.trim() === "" || !selectedDay) {
      alert("Te rog completează toate câmpurile.");
      return;
    }

    if (!token) {
      console.error("Token inexistent!");
      return;
    }

    setIsLoading(true);
    try {
      const newEv = await createEveniment(token, {
        titlu,
        data: selectedDay.toISOString(),
        ora,
      });
      setEvenimente([...evenimente, newEv]);
      setTitlu("");
      setOra("");
      setShowForm(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!token) {
      console.error("Token inexistent!");
      return;
    }

    if (confirm("Sigur vrei să ștergi acest eveniment?")) {
      await deleteEveniment(token, id);
      setEvenimente(evenimente.filter((ev) => ev.id !== id));
    }
  }

  async function handleEdit(id: number) {
    if (!token) {
      console.error("Token inexistent!");
      return;
    }

    await updateEveniment(token, id, {
      titlu: editTitlu,
      ora: editOra,
      data: editData ? editData.toISOString() : undefined,
    });

    setEvenimente(
      evenimente.map((ev) =>
        ev.id === id
          ? { ...ev, titlu: editTitlu, ora: editOra, data: editData?.toISOString() || ev.data }
          : ev
      )
    );
    setEditingId(null);
  }

  const filteredEvents = evenimente.filter(
    (ev) => new Date(ev.data).toDateString() === selectedDay.toDateString()
  );

  const zileCuEvenimente = new Set(
    evenimente.map((ev) => new Date(ev.data).toDateString())
  );

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-pink-600 flex items-center gap-2">
        📅 Calendar & Task-uri
      </h2>

      <div className="rounded-3xl border-0 bg-white/80 backdrop-blur-lg shadow-xl p-4">
        <DayPicker
          mode="single"
          required={true}
          selected={selectedDay}
          onSelect={handleDaySelect}
          modifiers={{
            cuEveniment: (date) => zileCuEvenimente.has(date.toDateString()),
          }}
          modifiersClassNames={{
            cuEveniment: "bg-pink-300 text-white",
          }}
          className="p-2 [&_.rdp-day_selected]:bg-pink-500 [&_.rdp-day_selected]:text-white [&_.rdp-day]:rounded-full [&_.rdp-day]:transition-all [&_.rdp-day:hover]:bg-pink-100"
        />
      </div>

      <div className="rounded-3xl border-0 bg-white/80 backdrop-blur-lg shadow-xl p-4 flex flex-col gap-4 max-w-full w-full">
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 text-pink-600 hover:text-pink-800 transition font-semibold"
          >
            <span className="text-xl">➕</span> Adaugă eveniment
          </button>

          {showForm && (
            <div className="flex flex-wrap items-center gap-2 animate-fade-in">
              <input
                type="text"
                value={titlu}
                onChange={(e) => setTitlu(e.target.value)}
                placeholder="Titlu eveniment"
                className="border rounded px-2 py-1 mb-1"
              />
              <input
                type="time"
                value={ora}
                onChange={(e) => setOra(e.target.value)}
                className="border rounded px-2 py-1"
              />
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-pink-500 text-white px-4 py-1 rounded hover:bg-pink-600 transition whitespace-nowrap disabled:opacity-50"
              >
                {isLoading ? "Salvează..." : "Salvează"}
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-gray-700">
            Evenimente pe {selectedDay.toLocaleDateString()}
          </h3>
          {filteredEvents.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {filteredEvents.map((ev) => (
                <li
                  key={ev.id}
                  className="flex items-start justify-between bg-white shadow rounded-lg px-4 py-2 border hover:bg-gray-50 transition"
                >
                  <div className="flex flex-col gap-1">
                    {editingId === ev.id ? (
                      <>
                        <input
                          type="text"
                          value={editTitlu}
                          onChange={(e) => setEditTitlu(e.target.value)}
                          className="border rounded px-2 py-1 mb-1"
                        />
                        <input
                          type="time"
                          value={editOra}
                          onChange={(e) => setEditOra(e.target.value)}
                          className="border rounded px-2 py-1 mb-1"
                        />
                        <DayPicker
                          mode="single"
                          selected={editData ? new Date(editData) : new Date(ev.data)}
                          onSelect={(date) => setEditData(date ?? null)}
                          className="mb-2"
                        />
                        <div className="flex gap-2 mt-2">
                          <Button onClick={() => handleEdit(ev.id)}>Salvează</Button>
                          <Button variant="ghost" onClick={() => setEditingId(null)}>
                            Anulează
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="font-medium">{ev.titlu}</div>
                        <span className="inline-block bg-pink-100 text-pink-700 text-xs font-medium px-2 py-0.5 rounded mt-1">
                          {ev.ora}
                        </span>
                      </>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        ⋮
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setEditingId(ev.id);
                          setEditTitlu(ev.titlu);
                          setEditOra(ev.ora);
                          setEditData(new Date(ev.data));
                        }}
                      >
                        Editare
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(ev.id)}>
                        Șterge
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic flex items-center gap-2">
               Niciun eveniment pentru această zi.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
