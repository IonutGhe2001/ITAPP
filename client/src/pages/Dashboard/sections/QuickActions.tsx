"use client";

import { useState } from "react";
import { UserPlusIcon, LaptopIcon, FileTextIcon, UserCogIcon } from "lucide-react";
import ModalAddColeg from "../modals/ModalAddColeg";
import ModalAddEchipament from "../modals/ModalAddEchipament";
import ModalProcesVerbal from "../modals/ModalProcesVerbal";
import ModalCreateUser from "../modals/ModalCreateUser"; // nou
import { Button } from "@/components/ui/button";

export default function QuickActions() {
  const [showColegModal, setShowColegModal] = useState(false);
  const [showEchipamentModal, setShowEchipamentModal] = useState(false);
  const [showProcesModal, setShowProcesModal] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false); // nou

  return (
    <>
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
  <Button onClick={() => setShowColegModal(true)} variant="outline" className="min-w-[180px] flex items-center justify-center gap-3 rounded-2xl border bg-chart-1/10 px-6 py-4 text-sm font-medium text-foreground hover:scale-105 transition-all">
    <UserPlusIcon className="w-5 h-5" />
    Adaugă coleg
  </Button>

  <Button onClick={() => setShowEchipamentModal(true)} variant="outline" className="min-w-[180px] flex items-center justify-center gap-3 rounded-2xl border bg-chart-2/10 px-6 py-4 text-sm font-medium text-foreground hover:scale-105 transition-all">
    <LaptopIcon className="w-5 h-5" />
    Adaugă echipament
  </Button>

  <Button onClick={() => setShowProcesModal(true)} variant="outline" className="min-w-[180px] flex items-center justify-center gap-3 rounded-2xl border bg-chart-3/10 px-6 py-4 text-sm font-medium text-foreground hover:scale-105 transition-all">
    <FileTextIcon className="w-5 h-5" />
    Generează proces verbal
  </Button>

  <Button onClick={() => setShowCreateUserModal(true)} variant="outline" className="min-w-[180px] flex items-center justify-center gap-3 rounded-2xl border bg-chart-4/10 px-6 py-4 text-sm font-medium text-foreground hover:scale-105 transition-all">
    <UserCogIcon className="w-5 h-5" />
    Creează cont
  </Button>
</div>

      {showColegModal && <ModalAddColeg onClose={() => setShowColegModal(false)} />}
      {showEchipamentModal && <ModalAddEchipament onClose={() => setShowEchipamentModal(false)} />}
      {showProcesModal && <ModalProcesVerbal onClose={() => setShowProcesModal(false)} />}
      {showCreateUserModal && <ModalCreateUser onClose={() => setShowCreateUserModal(false)} />}
    </>
  );
}
