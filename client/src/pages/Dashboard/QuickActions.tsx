import { useState } from "react";
import ModalAddColeg from "./ModalAddColeg";
import ModalAddEchipament from "./ModalAddEchipament";
import { UserPlusIcon, LaptopIcon } from "lucide-react";

export default function QuickActions() {
  const [showColegModal, setShowColegModal] = useState(false);
  const [showEchipamentModal, setShowEchipamentModal] = useState(false);

  return (
    <section>
      <h2 className="text-sm font-semibold text-primary mb-4">Funcții rapide</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => setShowColegModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-primary/90 text-white rounded-xl hover:bg-primary-dark transition focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <UserPlusIcon className="w-5 h-5" />
          Adaugă coleg
        </button>
        <button
          onClick={() => setShowEchipamentModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-primary/90 text-white rounded-xl hover:bg-primary-dark transition focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <LaptopIcon className="w-5 h-5" />
          Adaugă echipament
        </button>
      </div>

      {showColegModal && <ModalAddColeg onClose={() => setShowColegModal(false)} />}
      {showEchipamentModal && <ModalAddEchipament onClose={() => setShowEchipamentModal(false)} />}
    </section>
  );
}
