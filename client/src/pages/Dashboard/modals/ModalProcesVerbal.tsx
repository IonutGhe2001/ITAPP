"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Expand, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAngajati } from "@/features/employees";
import api from "@/services/api";
import { useToast } from "@/hooks/use-toast/use-toast-hook";

interface ModalProcesVerbalProps {
  onClose: () => void;
}

export default function ModalProcesVerbal({ onClose }: ModalProcesVerbalProps) {
  const [angajati, setAngajati] = useState<{ id: string; numeComplet: string }[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [tip, setTip] = useState<string>("PREDARE_PRIMIRE");
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    getAngajati()
      .then((res) => setAngajati(res.data))
      .catch((err) => console.error("Eroare la încărcare angajați", err));
  }, []);

 const genereazaProces = async () => {
  if (!selectedId) return;
  setLoading(true);
  try {
     const res = await api.post(
      "/procese-verbale",
      { angajatId: selectedId, tip },
      {
        responseType: "blob",
      }
    );
    const file = new Blob([res.data], { type: "application/pdf" });
    const url = URL.createObjectURL(file);
    setPdfUrl(url);
    toast({ title: "Proces verbal generat", description: "PDF-ul a fost creat cu succes." });
  } catch (_err) {
    console.error("Eroare la generare proces verbal", _err);
    toast({ title: "Eroare", description: "Eroare la generarea PDF-ului.", variant: "destructive" });
  } finally {
    setLoading(false);
  }
};

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generează proces verbal</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="angajat">Selectează angajat</Label>
            <Select value={selectedId} onValueChange={setSelectedId}>
              <SelectTrigger id="angajat">
                <SelectValue placeholder="Selectează colegul" />
              </SelectTrigger>
              <SelectContent>
                {angajati.map((angajat) => (
                  <SelectItem key={angajat.id} value={angajat.id}>
                    {angajat.numeComplet}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="tip">Tip proces verbal</Label>
            <Select value={tip} onValueChange={setTip}>
              <SelectTrigger id="tip">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PREDARE_PRIMIRE">Predare-primire</SelectItem>
                <SelectItem value="RESTITUIRE">Restituire</SelectItem>
                <SelectItem value="SCHIMB">Schimb</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button
            onClick={genereazaProces}
            disabled={!selectedId || loading}
            className="w-full bg-primary text-white hover:bg-primary/90"
          >
            {loading ? "Se generează..." : "Generează PDF"}
          </Button>

          {pdfUrl && (
            <div className="mt-4">
              <Label>Preview PDF</Label>
              <div className="relative">
                <iframe src={pdfUrl} className="w-full h-[60vh] max-h-[500px] border" />
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => setFullscreen(true)}
                  className="absolute right-2 top-2"
                >
                  <Expand className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {fullscreen && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center">
              <div className="relative w-full h-full">
                <iframe src={pdfUrl} className="w-full h-full" />
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => setFullscreen(false)}
                  className="absolute right-4 top-4"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}