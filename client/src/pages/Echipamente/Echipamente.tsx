import { useEffect, useState } from "react";
import { getEchipamente, deleteEchipament } from "../../services/echipamenteService";
import EquipmentTabs from "./EquipmentTabs";
import EquipmentFilter from "./EquipmentFilter";
import EquipmentList from "./EquipmentList";

export default function Echipamente() {
  const [echipamente, setEchipamente] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [tip, setTip] = useState("toate");

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
        onEdit={(id) => console.log("Editează:", id)}
        onDelete={handleDelete}
      />
    </div>
  );
}
