import React, { Suspense, useCallback, useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ModalAsigneazaEchipament from './ModalAsigneazaEchipament';
import ModalEditColeg from './ModalEditColeg';
import AngajatDocumentSection from './AngajatDocumentSection';
import { useUpdateEchipament } from '@/features/equipment';
import type { Angajat, Echipament } from '@/features/equipment/types';
import type { AngajatWithRelations } from '@/features/employees/angajatiService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatusBadge from '@/components/StatusBadge';
import { EquipmentIcon } from '@/features/equipment';
import { getEmployeeLifecycleStatus } from './useColegiFilter';
import { Mail, Phone, UserRound, MapPin, Laptop2, BadgeCheck } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useToast } from '@/hooks/use-toast/use-toast-hook';
import { handleApiError } from '@/utils/apiError';
import http from '@/services/http';

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
  detailColeg: AngajatWithRelations | null;
  setDetailColeg: React.Dispatch<React.SetStateAction<AngajatWithRelations | null>>;
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
  detailColeg,
  setDetailColeg,
}: ColegModalsProps) {
  const updateMutation = useUpdateEchipament();
  const [activeTab, setActiveTab] = useState<'profile' | 'equipment' | 'documents'>('profile');
  const [selectedEquipmentIds, setSelectedEquipmentIds] = useState<string[]>([]);
  const [bulkReplaceIds, setBulkReplaceIds] = useState<string[] | null>(null);
  const [isProcessingEquipment, setIsProcessingEquipment] = useState(false);
  const [detailToRestore, setDetailToRestore] = useState<AngajatWithRelations | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const { toast } = useToast();

  // Fetch documents when detailColeg opens
  useEffect(() => {
    if (detailColeg?.id) {
      fetchDocuments();
    } else {
      setDocuments([]);
    }
  }, [detailColeg?.id]);

  const fetchDocuments = async () => {
    if (!detailColeg?.id) return;
    try {
      const docs = await http.get(`/angajati/${detailColeg.id}/documents`);
      setDocuments(docs);
    } catch (err: unknown) {
      console.error('Error fetching documents:', err);
    }
  };

    const restoreDetailProfile = useCallback(
    (transform?: (detail: AngajatWithRelations) => AngajatWithRelations) => {
      let restored = false;
      setDetailColeg((current) => {
        const base = current ?? detailToRestore;
        if (!base) return current;
        restored = true;
        const updated = transform ? transform(base) : base;
        return {
          ...updated,
          echipamente: Array.isArray(updated.echipamente)
            ? [...updated.echipamente]
            : updated.echipamente,
        };
      });
      if (restored) {
        setActiveTab('profile');
        setSelectedEquipmentIds([]);
        setBulkReplaceIds(null);
        setDetailToRestore(null);
      }
    },
    [detailToRestore, setDetailColeg, setActiveTab, setSelectedEquipmentIds, setBulkReplaceIds, setDetailToRestore]
  );

  const handleAssignModalClose = useCallback(() => {
    setSelectedAngajatId(null);
    restoreDetailProfile();
  }, [restoreDetailProfile, setSelectedAngajatId]);

  const handleAssignModalSuccess = useCallback(
    (result?: { assignedEquipment?: Echipament[] }) => {
      if (result?.assignedEquipment?.length) {
        restoreDetailProfile((detail) => {
          const existing = Array.isArray(detail.echipamente) ? detail.echipamente : [];
          const existingIds = new Set(existing.map((item) => item.id));
          const additions = result.assignedEquipment?.filter((item) => !existingIds.has(item.id)) ?? [];
          return {
            ...detail,
            echipamente: [...existing, ...additions],
          };
        });
      } else {
        restoreDetailProfile();
      }

      void refetch();
      setExpanded(new Set());
      setSelectedAngajatId(null);
    },
    [refetch, restoreDetailProfile, setExpanded, setSelectedAngajatId]
  );

  const handleBulkReturn = async (ids?: string[]) => {
    if (!detailColeg) return;
    const equipmentIds = ids ?? selectedEquipmentIds;
    if (!equipmentIds.length) return;
    setIsProcessingEquipment(true);
    try {
      await Promise.all(
        equipmentIds.map((equipmentId) =>
          updateMutation.mutateAsync({
            id: equipmentId,
            data: { angajatId: null, stare: 'in_stoc' },
          })
        )
      );

      await refetch();
      setDetailColeg((prev) =>
        prev
          ? {
              ...prev,
              echipamente: prev.echipamente.filter((item) => !equipmentIds.includes(item.id)),
            }
          : prev
      );
      setActiveTab('profile');
    } catch (err) {
      toast({
        title: 'Eroare la returnare',
        description: handleApiError(err, 'Nu am putut returna echipamentele.'),
        variant: 'destructive',
      });
    } finally {
      setIsProcessingEquipment(false);
      setSelectedEquipmentIds((prev) => prev.filter((id) => !equipmentIds.includes(id)));
    }
  };

  const handleStartBulkReplace = (ids?: string[]) => {
    if (!detailColeg) return;
    const equipmentIds = ids ?? selectedEquipmentIds;
    if (!equipmentIds.length) return;
    // Save detail state before closing dialog (same as assign equipment flow)
    setDetailToRestore({
      ...detailColeg,
      echipamente: Array.isArray(detailColeg.echipamente)
        ? [...detailColeg.echipamente]
        : [],
    });
    setBulkReplaceIds(equipmentIds);
    setDetailColeg(null);
    setActiveTab('profile');
  };

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
          onClose={handleAssignModalClose}
          onSuccess={handleAssignModalSuccess}
        />
      )}
      {replaceData && (
        <ModalAsigneazaEchipament
          angajatId={replaceData.colegId}
          filterTip={replaceData.type}
          oldEchipamentIds={[replaceData.equipmentId]}
          onReplace={async (oldIds, newIds) => {
            const [oldId] = oldIds;
            const [newId] = newIds;
            await updateMutation.mutateAsync({
              id: oldId,
              data: { angajatId: null, stare: 'in_stoc' },
            });
            await updateMutation.mutateAsync({
              id: newId,
              data: { angajatId: replaceData.colegId, stare: 'alocat' },
            });
            const payload = { predate: oldIds, primite: newIds };
          }}
          onClose={() => setReplaceData(null)}
          onSuccess={() => {
            void refetch();
            setExpanded(new Set());
            setReplaceData(null);
            setActiveTab('profile');
          }}
        />
      )}
      {bulkReplaceIds && detailToRestore && (
        <ModalAsigneazaEchipament
          angajatId={detailToRestore.id}
          oldEchipamentIds={bulkReplaceIds}
          onReplace={async (oldIds, newIds) => {
            for (const oldId of oldIds) {
              await updateMutation.mutateAsync({
                id: oldId,
                data: { angajatId: null, stare: 'in_stoc' },
              });
            }
            const assignedEquipment: Echipament[] = [];
            for (const newId of newIds) {
              const updated = await updateMutation.mutateAsync({
                id: newId,
                data: { angajatId: detailToRestore.id, stare: 'alocat' },
              });
              assignedEquipment.push(updated);
            }
            const payload = { predate: oldIds, primite: newIds };
            await refetch();
          }}
          onClose={() => {
            setBulkReplaceIds(null);
            restoreDetailProfile();
          }}
          onSuccess={() => {
            setBulkReplaceIds(null);
            setSelectedEquipmentIds([]);
            // Restore the detail dialog (refetch will provide updated equipment data)
            restoreDetailProfile();
            void refetch();
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
              setSelectedEquipmentIds([]);
              setBulkReplaceIds(null);
              setDetailToRestore(null);
            }
          }}
        >
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{detailColeg.numeComplet}</DialogTitle>
            </DialogHeader>
            <Tabs
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as 'profile' | 'equipment' | 'documents')}
              className="mt-4"
            >
              <TabsList className="grid w-full grid-cols-3 rounded-xl">
                <TabsTrigger value="profile">Profil</TabsTrigger>
                <TabsTrigger value="equipment">Echipamente</TabsTrigger>
                <TabsTrigger value="documents">Documente</TabsTrigger>
              </TabsList>
              <TabsContent value="profile" className="space-y-4 pt-4">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge
                    label={(() => {
                      const status = getEmployeeLifecycleStatus(detailColeg);
                      if (status === 'active') return 'Activ';
                      return 'Inactiv';
                    })()}
                    tone={((status) =>
                      status === 'active' ? 'success' : 'neutral')(
                      getEmployeeLifecycleStatus(detailColeg)
                    )}
                    withDot
                  />
                  {detailColeg.emailAccountCreatedAt && (
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
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-muted-foreground text-sm">
                    {detailColeg.echipamente.length > 0
                      ? `${detailColeg.echipamente.length} echipamente alocate`
                      : 'Nu există echipamente alocate.'}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        setDetailToRestore({
                          ...detailColeg,
                          echipamente: Array.isArray(detailColeg.echipamente)
                            ? [...detailColeg.echipamente]
                            : [],
                        });
                        setSelectedAngajatId(detailColeg.id);
                        setDetailColeg(null);
                        setActiveTab('profile');
                      }}
                    >
                      Asignează echipament
                    </Button>
                  </div>
                </div>
                {selectedEquipmentIds.length > 0 && (
                  <div className="border-red-100/70 bg-red-50/70 flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3">
                    <p className="text-sm font-semibold text-red-700">
                      {selectedEquipmentIds.length === 1
                        ? '1 echipament selectat'
                        : `${selectedEquipmentIds.length} echipamente selectate`}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          void handleBulkReturn();
                        }}
                        disabled={isProcessingEquipment}
                      >
                        Returnează
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleStartBulkReplace()}
                        disabled={isProcessingEquipment}
                      >
                        Înlocuiește
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedEquipmentIds([])}
                        disabled={isProcessingEquipment}
                      >
                        Anulează
                      </Button>
                    </div>
                  </div>
                )}
                {detailColeg.echipamente.length > 0 && (
                  <div className="grid gap-3">
                    {detailColeg.echipamente.map((eq) => {
                      const isSelected = selectedEquipmentIds.includes(eq.id);
                      return (
                        <div
                          key={eq.id}
                          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/70 bg-white/80 p-3 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/60"
                        >
                          <div className="flex flex-1 items-center gap-3">
                            <label className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {
                                  setSelectedEquipmentIds((prev) =>
                                    prev.includes(eq.id)
                                      ? prev.filter((item) => item !== eq.id)
                                      : [...prev, eq.id]
                                  );
                                }}
                                disabled={isProcessingEquipment}
                                className="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
                                aria-label={`Selectează ${eq.nume}`}
                              />
                              <div className="bg-primary/5 text-primary flex h-10 w-10 items-center justify-center rounded-xl">
                                <EquipmentIcon type={eq.tip} className="h-5 w-5" />
                              </div>
                            </label>
                            <div className="space-y-1 text-sm">
                              <Link
                                to={ROUTES.EQUIPMENT_DETAIL.replace(':id', eq.id)}
                                className="font-medium text-slate-900 hover:text-primary hover:underline dark:text-slate-100"
                              >
                                {eq.nume}
                              </Link>
                              <p className="text-muted-foreground text-xs">Serie: {eq.serie}</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <StatusBadge label={eq.tip} tone="info" className="uppercase" />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                void handleBulkReturn([eq.id]);
                              }}
                              disabled={isProcessingEquipment}
                            >
                              Returnează
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleStartBulkReplace([eq.id])}
                              disabled={isProcessingEquipment}
                            >
                              Înlocuiește
                            </Button>
                          </div>
                        </div>
                        );
                    })}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="documents" className="space-y-4 pt-4">
                <AngajatDocumentSection
                  angajatId={detailColeg.id}
                  documents={documents}
                  refetch={fetchDocuments}
                />
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
