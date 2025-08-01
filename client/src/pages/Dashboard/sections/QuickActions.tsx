"use client";

import React, { useEffect, useState, Suspense } from "react";
import {
  UserPlusIcon,
  LaptopIcon,
  FileTextIcon,
  UserCogIcon,
  DownloadIcon,
} from "lucide-react";
const ModalAddColeg = React.lazy(() => import("../modals/ModalAddColeg"));
const ModalAddEchipament = React.lazy(() => import("../modals/ModalAddEchipament"));
const ModalProcesVerbal = React.lazy(() => import("../modals/ModalProcesVerbal"));
const ModalCreateUser = React.lazy(() => import("../modals/ModalCreateUser"));
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getQueueCount } from "@/features/proceseVerbale/pvQueue";

export default function QuickActions() {
  const [showColegModal, setShowColegModal] = useState(false);
  const [showEchipamentModal, setShowEchipamentModal] = useState(false);
  const [showProcesModal, setShowProcesModal] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [count, setCount] = useState(getQueueCount());


  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "e") {
        e.preventDefault();
        setShowEchipamentModal(true);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

    useEffect(() => {
    const update = () => setCount(getQueueCount());
    window.addEventListener("focus", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("focus", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  const handleExportJSON = () => {
    const fakeData = { message: "Backup local JSON" };
    const blob = new Blob([JSON.stringify(fakeData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "backup.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="w-full max-w-5xl mx-auto grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4">
        <Button
          onClick={() => setShowColegModal(true)}
          variant="outline"
          className="w-full h-[100px] min-w-[150px] flex flex-col items-center justify-center gap-2 rounded-2xl border bg-chart-3/10 px-4 py-2 text-sm font-medium text-foreground hover:scale-105 transition-all whitespace-normal break-words text-center"
        >
          <UserPlusIcon className="w-5 h-5" />
          <span className="whitespace-normal break-words leading-tight">Adaugă coleg</span>
        </Button>

        <Button
          onClick={() => setShowEchipamentModal(true)}
          variant="outline"
          className="w-full h-[100px] min-w-[150px] flex flex-col items-center justify-center gap-2 rounded-2xl border bg-chart-3/10 px-4 py-2 text-sm font-medium text-foreground hover:scale-105 transition-all whitespace-normal break-words text-center"
        >
          <LaptopIcon className="w-5 h-5" />
          <span className="whitespace-normal break-words leading-tight">Adaugă echipament</span>
        </Button>

        <Button
          onClick={() => setShowProcesModal(true)}
          variant="outline"
          className="relative w-full h-[100px] min-w-[150px] flex flex-col items-center justify-center gap-2 rounded-2xl border bg-chart-3/10 px-4 py-2 text-sm font-medium text-foreground hover:scale-105 transition-all whitespace-normal break-words text-center"
        >
         <FileTextIcon className="w-5 h-5" />
          <span className="whitespace-normal break-words leading-tight">Generează proces verbal</span>
          {count > 0 && (
            <Badge variant="destructive" className="absolute -top-2 -right-2">
              {count}
            </Badge>
          )}
        </Button>

        <Button
          onClick={() => setShowCreateUserModal(true)}
          variant="outline"
          className="w-full h-[100px] min-w-[150px] flex flex-col items-center justify-center gap-2 rounded-2xl border bg-chart-3/10 px-4 py-2 text-sm font-medium text-foreground hover:scale-105 transition-all whitespace-normal break-words text-center"
        >
        <UserCogIcon className="w-5 h-5" />
          <span className="whitespace-normal break-words leading-tight">Creează cont</span>
        </Button>

        <Button
          onClick={handleExportJSON}
          variant="outline"
          className="w-full h-[100px] min-w-[150px] flex flex-col items-center justify-center gap-2 rounded-2xl border bg-chart-3/10 px-4 py-2 text-sm font-medium text-foreground hover:scale-105 transition-all whitespace-normal break-words text-center"
        >
          <DownloadIcon className="w-5 h-5" />
          <span className="whitespace-normal break-words leading-tight">Exportă JSON</span>
        </Button>
      </div>

      {/* Modaluri */}
     <Suspense fallback={null}>
        {showColegModal && (
          <ModalAddColeg onClose={() => setShowColegModal(false)} />
        )}
        {showEchipamentModal && (
          <ModalAddEchipament onClose={() => setShowEchipamentModal(false)} />
        )}
        {showProcesModal && (
          <ModalProcesVerbal onClose={() => setShowProcesModal(false)} />
        )}
        {showCreateUserModal && (
          <ModalCreateUser onClose={() => setShowCreateUserModal(false)} />
        )}
      </Suspense>
    </>
  );
}
