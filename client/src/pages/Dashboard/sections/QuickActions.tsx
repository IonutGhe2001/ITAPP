"use client";

import { useState } from "react";
import { UserPlusIcon, LaptopIcon } from "lucide-react";
import ModalAddColeg from "../modals/ModalAddColeg";
import ModalAddEchipament from "../modals/ModalAddEchipament";
import { Button } from "@components/ui/button";

export default function QuickActions() {
  const [showColegModal, setShowColegModal] = useState(false);
  const [showEchipamentModal, setShowEchipamentModal] = useState(false);

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() => setShowColegModal(true)}
          className="flex items-center gap-2"
        >
          <UserPlusIcon className="w-4 h-4" />
          Adaugă coleg
        </Button>

        <Button
          variant="outline"
          onClick={() => setShowEchipamentModal(true)}
          className="flex items-center gap-2"
        >
          <LaptopIcon className="w-4 h-4" />
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
