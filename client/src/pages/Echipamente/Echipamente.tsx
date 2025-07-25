import { useState } from "react";
import type { Echipament } from "@/features/echipamente/types";
import {
    useEchipamente,
  useDeleteEchipament,
  useUpdateEchipament,
} from "../../services/echipamenteService";
import EquipmentTabs from "../../features/echipamente/components/EquipmentTabs";
import EquipmentFilter from "../../features/echipamente/components/EquipmentFilter";
import EquipmentList from "../../features/echipamente/components/EquipmentList";
import ModalEditEchipament from "../../features/echipamente/components/ModalEditEchipament";
import ImportEchipamente from "../../features/echipamente/ImportEchipamente";

export default function Echipamente() {
 const { data: echipamente = [], refetch } = useEchipamente();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [tip, setTip] = useState("toate");

  const [selected, setSelected] = useState<any | null>(null);

  const deleteMutation = useDeleteEchipament();
  const updateMutation = useUpdateEchipament();

  const filtered = echipamente.filter((e: Echipament) => {
    if (tip !== "toate" && e.tip !== tip) return false;
    if (status && e.stare !== status) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      if (!e.nume.toLowerCase().includes(q) && !e.serie?.toLowerCase().includes(q)) return false;
    }

  return true;
  });

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  const handleEdit = async (data: Echipament & { __editMode?: boolean }) => {
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
         const res = await updateMutation.mutateAsync({ id: data.id, data: payload });
        if (!res || !(res as any).id) throw new Error("Obiectul returnat nu este valid");
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
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
        </div>
        <div>
          <ImportEchipamente onImportSuccess={() => refetch()} />
        </div>
      </div>

      {selected && (
        <ModalEditEchipament
            echipament={selected}
            onClose={() => setSelected(null)}
            onUpdated={() => setSelected(null)}
          />
      )}
    </div>
  );
}
