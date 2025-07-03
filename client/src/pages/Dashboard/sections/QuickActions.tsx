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
    <section className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-pink-600 flex items-center gap-2">
        🎯 Acțiuni rapide
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Button
  onClick={() => setShowColegModal(true)}
  className="flex items-center justify-center gap-3 bg-pink-500 text-white h-16 rounded-full shadow-xl px-6 hover:bg-pink-600 transition-all duration-300 ease-out"
>
  <UserPlusIcon className="w-6 h-6" />
  <span className="text-base font-semibold">Adaugă coleg</span>
</Button>

<Button
  onClick={() => setShowEchipamentModal(true)}
  className="flex items-center justify-center gap-3 bg-red-500 text-white h-16 rounded-full shadow-xl px-6 hover:bg-red-600 transition-all duration-300 ease-out"
>
  <LaptopIcon className="w-6 h-6" />
  <span className="text-base font-semibold">Adaugă echipament</span>
</Button>
      </div>

      {showColegModal && <ModalAddColeg onClose={() => setShowColegModal(false)} />}
      {showEchipamentModal && <ModalAddEchipament onClose={() => setShowEchipamentModal(false)} />}
    </section>
  );
}
