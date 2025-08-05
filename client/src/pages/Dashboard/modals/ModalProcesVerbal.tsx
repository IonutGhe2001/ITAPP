'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Expand, X } from 'lucide-react';
import { getAngajati } from '@/features/employees';
import http from '@/services/http'
import { useToast } from '@/hooks/use-toast/use-toast-hook';

interface ModalProcesVerbalProps {
  onClose: () => void;
}

export default function ModalProcesVerbal({ onClose }: ModalProcesVerbalProps) {
  const [angajati, setAngajati] = useState<{ id: string; numeComplet: string }[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    getAngajati()
      .then(setAngajati)
      .catch((err) => console.error('Eroare la încărcare angajați', err));
  }, []);

  const genereazaProces = async () => {
    if (!selectedId) return;
    setLoading(true);
    try {
      const blob = await http.post<Blob>(
        '/procese-verbale',
        { angajatId: selectedId },
        {
          responseType: 'blob',
        }
      );
      const file = new Blob([blob], { type: 'application/pdf' });
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
      toast({ title: 'Proces verbal generat', description: 'PDF-ul a fost creat cu succes.' });
    } catch (_err) {
      console.error('Eroare la generare proces verbal', _err);
      toast({
        title: 'Eroare',
        description: 'Eroare la generarea PDF-ului.',
        variant: 'destructive',
      });
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

          <Button
            onClick={genereazaProces}
            disabled={!selectedId || loading}
            className="bg-primary hover:bg-primary/90 w-full text-white"
          >
            {loading ? 'Se generează...' : 'Generează PDF'}
          </Button>

          {pdfUrl && (
            <div className="mt-4">
              <Label>Preview PDF</Label>
              <div className="relative">
                <iframe src={pdfUrl} className="h-[60vh] max-h-[500px] w-full border" />
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => setFullscreen(true)}
                  className="absolute right-2 top-2"
                >
                  <Expand className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {fullscreen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
              <div className="relative h-full w-full">
                <iframe src={pdfUrl} className="h-full w-full" />
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => setFullscreen(false)}
                  className="absolute right-4 top-4"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
