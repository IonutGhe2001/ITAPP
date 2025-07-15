"use client";

import { useState } from "react";
import { UserPlusIcon, LaptopIcon } from "lucide-react";
import ModalAddColeg from "../modals/ModalAddColeg";
import ModalAddEchipament from "../modals/ModalAddEchipament";
import { Button } from "@/components/ui/button";

export default function QuickActions() {
  const [showColegModal, setShowColegModal] = useState(false);
  const [showEchipamentModal, setShowEchipamentModal] = useState(false);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Button
          onClick={() => setShowColegModal(true)}
          variant="outline"
          className="flex items-center justify-center gap-3 rounded-xl border border-border bg-chart-1/10 px-6 py-4 text-sm font-medium text-foreground shadow-sm hover:scale-105 hover:shadow-md transition-all duration-300"
        >
          <UserPlusIcon className="w-5 h-5 stroke-[1.5] text-chart-1 animate-in fade-in" />
          Adaugă coleg
        </Button>

        <Button
          onClick={() => setShowEchipamentModal(true)}
          variant="outline"
          className="flex items-center justify-center gap-3 rounded-xl border border-border bg-chart-2/10 px-6 py-4 text-sm font-medium text-foreground shadow-sm hover:scale-105 hover:shadow-md transition-all duration-300"
        >
          <LaptopIcon className="w-5 h-5 stroke-[1.5] text-chart-2 animate-in fade-in" />
          Adaugă echipament
        </Button>
      </div>

      {showColegModal && (
        <ModalAddColeg onClose={() => setShowColegModal(false)} />
      )}

      {showEchipamentModal && (
        <ModalAddEchipament onClose={() => setShowEchipamentModal(false)} />
      )}
    </>
  );
}
