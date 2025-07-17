import { useEffect, useState } from "react";
import {
  getEchipamente,
  deleteEchipament,
  updateEchipament,
} from "../../services/echipamenteService";
import EquipmentTabs from "./EquipmentTabs";
import EquipmentFilter from "./EquipmentFilter";
import EquipmentList from "./EquipmentList";
import ModalEditEchipament from "./ModalEditEchipament";

export default function Echipamente() {
  const [echipamente, setEchipamente] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [tip, setTip] = useState("toate");

  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => {
    getEchipamente().then((res) => {
      setEchipamente(res.data);
      setFiltered(res.data);
    });
  }, []);

  useEffect(() => {
    let data = [...echipamente];

    if (tip !== "toate") {
      data = data.filter((e) => e.tip === tip);
    }

    if (status) {
      data = data.filter((e) => e.stare === status);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (e) =>
          e.nume.toLowerCase().includes(q) ||
          e.serie?.toLowerCase().includes(q)
      );
    }

    setFiltered(data);
  }, [search, status, tip, echipamente]);

  const handleDelete = async (id: string) => {
    await deleteEchipament(id);
    setEchipamente((prev) => prev.filter((e) => e.id !== id));
  };

 const handleEdit = async (data: any) => {
  const isQuickUpdate = "angajatId" in data && data.__editMode !== true;

  if (isQuickUpdate) {
    const payload = {
      nume: data.nume?.trim() || "",
      tip: data.tip?.trim() || "",
      serie: data.serie?.trim() || "",
      angajatId: data.angajatId === null ? null : data.angajatId ?? null,
      stare: data.stare ?? undefined,
    };

    Object.keys(payload).forEach((key) => {
      if (payload[key as keyof typeof payload] === "") {
        delete payload[key as keyof typeof payload];
      }
    });

    try {
     const res = await updateEchipament(data.id, payload);
if (!res || !res.id) throw new Error("Obiectul returnat nu este valid");
setEchipamente((prev) =>
  prev.map((e) => (e?.id === data.id ? res : e))
);
    } catch (error: any) {
      console.error("❌ Eroare la update rapid:", error.response?.data || error.message);
      alert("A apărut o eroare la actualizarea echipamentului.");
    }
  } else {
    setSelected(data); 
  }
};

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        {/* Poți adăuga aici butonul pentru "Adaugă echipament" */}
      </div>

      <EquipmentTabs active={tip} onChange={setTip} />
      <EquipmentFilter
        search={search}
        status={status}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
      />

      <EquipmentList
        echipamente={filtered}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {selected && (
        <ModalEditEchipament
          echipament={selected}
          onClose={() => setSelected(null)}
        onUpdated={(updated: any) => {
  if (!updated || !updated.id) {
    console.error("⚠️ Obiectul actualizat e invalid:", updated);
    return;
  }

  setEchipamente((prev) =>
    prev.map((e) => (e?.id === updated.id ? updated : e))
  );
  setSelected(null);
}}
        />
      )}
    </div>
  );
}
