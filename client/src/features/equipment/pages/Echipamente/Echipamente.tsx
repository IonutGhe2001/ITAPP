import { useState } from "react";
import type { Echipament } from "@/features/equipment/types";
import {
    useEchipamente,
  useDeleteEchipament,
  useUpdateEchipament,
} from "@/features/equipment";
import {
  EquipmentFilter,
  EquipmentList,
  ModalEditEchipament,
  ImportEchipamente,
} from "@/features/equipment";
import Container from "@/components/Container";

export default function Echipamente() {
 const {
    data: echipamente = [],
    refetch,
  } = useEchipamente() as { data: Echipament[] | undefined; refetch: () => void };

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
const [sort, setSort] = useState("asc");

const [selected, setSelected] = useState<(Echipament & { __editMode?: boolean }) | null>(null);

  const deleteMutation = useDeleteEchipament();
  const updateMutation = useUpdateEchipament();

   const filtered = echipamente
    .filter((e: Echipament) => {
      if (status && e.stare !== status) return false;

    const q = search.trim().toLowerCase();
      if (q) {
        if (!e.nume.toLowerCase().includes(q) && !e.serie?.toLowerCase().includes(q)) {
          return false;
        }
      }
    return true;
    })
    .sort((a: Echipament, b: Echipament) =>
      sort === "asc"
        ? a.nume.localeCompare(b.nume)
        : b.nume.localeCompare(a.nume)
    );

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
        if (!res || !res.id) throw new Error("Obiectul returnat nu este valid");
      } catch (error: unknown) {
        const err = error as { response?: { data?: unknown }; message?: string };
        console.error("❌ Eroare la update rapid:", err.response?.data || err.message);
        alert("A apărut o eroare la actualizarea echipamentului.");
      }
    } else {
      setSelected(data);
    }
  };

  return (
    <Container className="py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          
          <EquipmentFilter
            search={search}
            status={status}
             sort={sort}
            onSearchChange={(value: string) => setSearch(value)}
            onStatusChange={(value: string) => setStatus(value)}
            onSortChange={(value: string) => setSort(value)}
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
    </Container>
  );
}
