import React, { Suspense, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ModalAsigneazaEchipament from './ModalAsigneazaEchipament';
import ModalEditColeg from './ModalEditColeg';
import { useUpdateEchipament } from '@/features/equipment';
import { genereazaProcesVerbal } from '@/features/proceseVerbale';
import { queueProcesVerbal } from '@/features/proceseVerbale/pvQueue';
import { getConfig } from '@/services/configService';
import type { Angajat } from '@/features/equipment/types';
import type { AngajatWithRelations } from '@/features/employees/angajatiService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatusBadge from '@/components/StatusBadge';
import { EquipmentIcon } from '@/features/equipment';
import { getEmployeeLifecycleStatus } from './useColegiFilter';
import { Mail, Phone, UserRound, MapPin, Laptop2, BadgeCheck } from 'lucide-react';

const ModalAddColeg = React.lazy(() => import('@/pages/Dashboard/modals/ModalAddColeg'));

interface ReplaceData {
  colegId: string;
  equipmentId: string;
  type: string;
}

interface ColegModalsProps {
  selectedAngajatId: string | null;
  setSelectedAngajatId: (id: string | null) => void;
  replaceData: ReplaceData | null;
  setReplaceData: (d: ReplaceData | null) => void;
  editColeg: Angajat | null;
  setEditColeg: (c: Angajat | null) => void;
  confirmDelete: Angajat | null;
  setConfirmDelete: (c: Angajat | null) => void;
  showAddModal: boolean;
  setShowAddModal: (v: boolean) => void;
  search: string;
  refetch: () => Promise<unknown>;
  setExpanded: React.Dispatch<React.SetStateAction<Set<string>>>;
  handleDelete: (id: string) => void;
  onPVChange: (colegId: string, change: { predate?: string[]; primite?: string[] }) => void;
  detailColeg: AngajatWithRelations | null;
  setDetailColeg: (value: AngajatWithRelations | null) => void;
}

export default function ColegModals({
  selectedAngajatId,
  setSelectedAngajatId,
  replaceData,
  setReplaceData,
  editColeg,
  setEditColeg,
  confirmDelete,
  setConfirmDelete,
  showAddModal,
  setShowAddModal,
  search,
  refetch,
  setExpanded,
  handleDelete,
  onPVChange,
  detailColeg,
  setDetailColeg,
}: ColegModalsProps) {
  const updateMutation = useUpdateEchipament();
  const [activeTab, setActiveTab] = useState<'profile' | 'equipment'>('profile');

  const departmentName = useMemo(() => {
    if (!detailColeg) return '';
    if ('department' in detailColeg) {
      const department = (detailColeg as unknown as { department?: unknown }).department;
      if (typeof department === 'string') return department;
      if (department && typeof department === 'object' && 'name' in department) {
        const name = (department as { name?: unknown }).name;
        if (typeof name === 'string') return name;
      }
    }
    if (
      'departmentName' in detailColeg &&
      typeof (detailColeg as { departmentName?: unknown }).departmentName === 'string'
    ) {
      return (detailColeg as { departmentName: string }).departmentName;
    }
    return '';
  }, [detailColeg]);

  return (
    <>
      {selectedAngajatId && (
        <ModalAsigneazaEchipament
          angajatId={selectedAngajatId}
          onClose={() => setSelectedAngajatId(null)}
          onPendingPV={(change) => onPVChange(selectedAngajatId, change)}
          onSuccess={() => {
            void refetch();
            setExpanded(new Set());
            setSelectedAngajatId(null);
          }}
        />
      )}
      {replaceData && (
        <ModalAsigneazaEchipament
          angajatId={replaceData.colegId}
          filterTip={replaceData.type}
          oldEchipamentId={replaceData.equipmentId}
          onReplace={async (oldId, newId) => {
            await updateMutation.mutateAsync({
              id: oldId,
              data: { angajatId: null, stare: 'in_stoc' },
            });
            await updateMutation.mutateAsync({
              id: newId,
              data: { angajatId: replaceData.colegId, stare: 'alocat' },
            });
            const { pvGenerationMode } = await getConfig();
            if (pvGenerationMode === 'auto') {
              const url = await genereazaProcesVerbal(replaceData.colegId, 'SCHIMB', {
                predate: [oldId],
                primite: [newId],
              });
              window.open(url, '_blank');
            } else {
              queueProcesVerbal(replaceData.colegId, 'SCHIMB', {
                predate: [oldId],
                primite: [newId],
              });
            }
          }}
          onPendingPV={(change) => onPVChange(replaceData.colegId, change)}
          onClose={() => setReplaceData(null)}
          onSuccess={() => {
            void refetch();
            setExpanded(new Set());
            setReplaceData(null);
          }}
        />
      )}
      {editColeg && (
        <ModalEditColeg
          coleg={editColeg}
          onClose={() => setEditColeg(null)}
          onSuccess={() => {
            void refetch();
            setExpanded(new Set());
          }}
        />
      )}
      {confirmDelete && (
        <Dialog open onOpenChange={() => setConfirmDelete(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmare ștergere</DialogTitle>
            </DialogHeader>
            <p className="text-muted-foreground text-sm">
              Ștergerea acestui coleg va elibera echipamentele asignate. Continuă?
            </p>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setConfirmDelete(null)}>
                Anulează
              </Button>
              <Button
                onClick={() => {
                  handleDelete(confirmDelete.id);
                  setConfirmDelete(null);
                }}
              >
                Confirmă
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
      <Suspense fallback={null}>
        {showAddModal && (
          <ModalAddColeg onClose={() => setShowAddModal(false)} defaultName={search.trim()} />
        )}
      </Suspense>

      {detailColeg && (
        <Dialog
          open
          onOpenChange={(open) => {
            if (!open) {
              setDetailColeg(null);
              setActiveTab('profile');
            }
          }}
        >
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{detailColeg.numeComplet}</DialogTitle>
            </DialogHeader>
            <Tabs
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as 'profile' | 'equipment')}
              className="mt-4"
            >
              <TabsList className="grid w-full grid-cols-2 rounded-xl">
                <TabsTrigger value="profile">Profil</TabsTrigger>
                <TabsTrigger value="equipment">Echipamente</TabsTrigger>
              </TabsList>
              <TabsContent value="profile" className="space-y-4 pt-4">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge
                    label={(() => {
                      const status = getEmployeeLifecycleStatus(detailColeg);
                      if (status === 'active') return 'Activ';
                      if (status === 'pending') return 'În așteptare';
                      return 'Inactiv';
                    })()}
                    tone={((status) =>
                      status === 'active'
                        ? 'success'
                        : status === 'pending'
                          ? 'warning'
                          : 'neutral')(getEmployeeLifecycleStatus(detailColeg))}
                    withDot
                  />
                  {detailColeg.emailAccountStatus === 'PENDING' && (
                    <StatusBadge label="Email pending" tone="warning" />
                  )}
                  {detailColeg.emailAccountStatus === 'CREATED' && (
                    <StatusBadge label="Email activ" tone="success" />
                  )}
                </div>
                <div className="grid gap-4 rounded-xl border border-slate-200/70 bg-slate-50/80 p-4 sm:grid-cols-2 dark:border-slate-800/60 dark:bg-slate-900/40">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <UserRound className="h-4 w-4 text-slate-400" aria-hidden="true" />
                      <span className="font-medium">{detailColeg.functie}</span>
                    </div>
                    {departmentName && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-slate-400" aria-hidden="true" />
                        <span>{departmentName}</span>
                      </div>
                    )}
                    {detailColeg.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-slate-400" aria-hidden="true" />
                        <a href={`mailto:${detailColeg.email}`} className="hover:underline">
                          {detailColeg.email}
                        </a>
                      </div>
                    )}
                    {detailColeg.telefon && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-slate-400" aria-hidden="true" />
                        <a href={`tel:${detailColeg.telefon}`} className="hover:underline">
                          {detailColeg.telefon}
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2 text-sm">
                    {detailColeg.cDataUsername && (
                      <div className="flex items-center gap-2">
                        <Laptop2 className="h-4 w-4 text-slate-400" aria-hidden="true" />
                        <span>c-data: {detailColeg.cDataUsername}</span>
                      </div>
                    )}
                    {detailColeg.cDataId && (
                      <div className="flex items-center gap-2">
                        <BadgeCheck className="h-4 w-4 text-slate-400" aria-hidden="true" />
                        <span>ID: {detailColeg.cDataId}</span>
                      </div>
                    )}
                    <span className="text-muted-foreground text-xs">
                      Cont c-data: {detailColeg.cDataCreated ? 'Creat' : 'Necreat'}
                    </span>
                    {detailColeg.cDataNotes && (
                      <p className="text-muted-foreground text-xs">{detailColeg.cDataNotes}</p>
                    )}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="equipment" className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground text-sm">
                    {detailColeg.echipamente.length > 0
                      ? `${detailColeg.echipamente.length} echipamente alocate`
                      : 'Nu există echipamente alocate.'}
                  </p>
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedAngajatId(detailColeg.id);
                      setDetailColeg(null);
                      setActiveTab('profile');
                    }}
                  >
                    Asignează echipament
                  </Button>
                </div>
                {detailColeg.echipamente.length > 0 && (
                  <div className="grid gap-3">
                    {detailColeg.echipamente.map((eq) => (
                      <div
                        key={eq.id}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/70 bg-white/80 p-3 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/60"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/5 text-primary flex h-10 w-10 items-center justify-center rounded-xl">
                            <EquipmentIcon type={eq.tip} className="h-5 w-5" />
                          </div>
                          <div className="space-y-1 text-sm">
                            <p className="font-medium text-slate-900 dark:text-slate-100">
                              {eq.nume}
                            </p>
                            <p className="text-muted-foreground text-xs">Serie: {eq.serie}</p>
                          </div>
                        </div>
                        <StatusBadge label={eq.tip} tone="info" className="uppercase" />
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
