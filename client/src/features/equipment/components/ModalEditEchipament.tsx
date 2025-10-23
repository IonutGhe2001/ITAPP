import React, { memo, Suspense, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useUpdateEchipament, useEchipamente } from '@/features/equipment';
import { useAllAngajati } from '@/features/employees';
import { useToast } from '@/hooks/use-toast/use-toast-hook';
import { handleApiError } from '@/utils/apiError';
import { useEchipamentForm } from '@/pages/Dashboard/modals/useEchipamentForm';
import EchipamentForm from './EchipamentForm';
const ModalAddColeg = React.lazy(() => import('@/pages/Dashboard/modals/ModalAddColeg'));
import type { ModalEditEchipamentProps, Angajat, Echipament } from '@/features/equipment/types';

function ModalEditEchipament({ echipament, onClose, onUpdated }: ModalEditEchipamentProps) {
  const initialData = useMemo(
    () => ({
      nume: echipament.nume,
      serie: echipament.serie,
      tip: echipament.tip,
      angajatId: echipament.angajatId || 'none',
      metadata: echipament.metadata as any,
    }),
    [echipament]
  );

  const {
    formData,
    setFormData,
    errors,
    setErrors,
    search,
    setSearch,
    showColegModal,
    setShowColegModal,
    validate,
    buildPayload,
  } = useEchipamentForm(initialData);

  const { data: angajati = [] } = useAllAngajati();
  const { data: echipamente = [] } = useEchipamente();
  const updateMutation = useUpdateEchipament();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (
      !validate({
        nume: 'Numele este obligatoriu.',
        serie: 'Seria este obligatorie.',
        tip: 'Tip invalid.',
      })
    )
      return;

    const payload = buildPayload();

    const duplicate = echipamente.find(
      (e) => e.tip === payload.tip && e.serie === payload.serie && e.id !== echipament.id
    );
    if (duplicate) {
      setErrors((prev) => ({ ...prev, serie: 'Un echipament cu aceasta serie exista deja.' }));
      return;
    }

    if (payload.angajatId) {
      const eqSameType = echipamente.find(
        (e) => e.angajatId === payload.angajatId && e.tip === payload.tip && e.id !== echipament.id
      );
      if (eqSameType) {
        setErrors((prev) => ({
          ...prev,
          angajatId: 'Angajatul are deja un echipament de acest tip.',
        }));
        return;
      }
    }

    try {
      const updated = await updateMutation.mutateAsync({ id: echipament.id, data: payload });
      toast({
        title: 'Echipament salvat',
        description: 'Modificările au fost salvate cu succes.',
      });
      onUpdated(updated as Echipament);
      onClose();
    } catch (err) {
      toast({
        title: 'Eroare la salvare',
        description: handleApiError(err),
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <Dialog open onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editează echipamentul</DialogTitle>
          </DialogHeader>
          <EchipamentForm
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            search={search}
            setSearch={setSearch}
            angajati={angajati as Angajat[]}
            onAddColeg={() => setShowColegModal(true)}
          />
          <Button onClick={handleSubmit}>Salvează</Button>
        </DialogContent>
      </Dialog>
      <Suspense fallback={null}>
        {showColegModal && <ModalAddColeg onClose={() => setShowColegModal(false)} />}
      </Suspense>
    </>
  );
}

export default memo(ModalEditEchipament);
