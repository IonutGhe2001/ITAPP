import { useState, useEffect, useRef, memo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useAllAngajati } from '@/features/employees';
import type { ModalPredaEchipamentProps, Angajat } from '@/features/equipment/types';

function ModalPredaEchipament({ echipament, onClose, onSubmit }: ModalPredaEchipamentProps) {
  const { data: angajati = [] } = useAllAngajati();
  const [angajatId, setAngajatId] = useState<string>('');
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    triggerRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (!angajatId) return alert('Selectează un angajat!');

    onSubmit({ ...echipament, angajatId, stare: 'alocat' });
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Alocă echipamentul</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Select value={angajatId} onValueChange={(val) => setAngajatId(val)}>
            <SelectTrigger ref={triggerRef} aria-label="Selectează angajatul">
              <SelectValue placeholder="Selectează angajatul" />
            </SelectTrigger>
            <SelectContent>
              {angajati.map((a: Angajat) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.numeComplet}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button className="w-full" onClick={handleSubmit}>
            Confirmă alocarea
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default memo(ModalPredaEchipament);
