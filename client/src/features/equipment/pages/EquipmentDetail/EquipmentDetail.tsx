import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Container from '@/components/Container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useEchipament,
  EQUIPMENT_STATUS_LABELS,
  useUpdateEchipament,
  ModalEditEchipament,
  ModalPredaEchipament,
} from '@/features/equipment';
import ConfirmDialog from '@/components/ConfirmDialog';
import { ROUTES } from '@/constants/routes';
import type { Echipament } from '@/features/equipment';
import { toast } from 'react-toastify';
import { handleApiError } from '@/utils/apiError';
import flattenMetadata from '@/utils/flattenMetadata';
import EquipmentAlerts from './EquipmentAlerts';
import ImageGallery from './ImageGallery';
import DocumentSection from './DocumentSection';
import QRCodeSection from './QRCodeSection';
import HistoryList from './HistoryList';

export default function EquipmentDetail() {
  const { id } = useParams();
  const { data, isLoading, refetch } = useEchipament(id || '');
  const updateMutation = useUpdateEchipament();
  const [showEdit, setShowEdit] = useState(false);
  const [showReassign, setShowReassign] = useState(false);
  const [confirmDefect, setConfirmDefect] = useState(false);

  const handleReassignSubmit = async (eq: Echipament) => {
    try {
      await updateMutation.mutateAsync({
        id: eq.id,
        data: { angajatId: eq.angajatId, stare: eq.stare },
      });
      setShowReassign(false);
      refetch();
      toast.success('Echipament reasignat cu succes');
    } catch (err: unknown) {
      toast.error(handleApiError(err, 'Eroare la reasignare'));
    }
  };

  const handleMarkDefect = async () => {
    if (!id) return;
    try {
      await updateMutation.mutateAsync({ id, data: { stare: 'mentenanta' } });
      setConfirmDefect(false);
      refetch();
      toast.success('Echipament marcat ca defect');
    } catch (err: unknown) {
      toast.error(handleApiError(err, 'Eroare la marcarea defectului'));
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="border-primary h-10 w-10 animate-spin rounded-full border-4 border-t-transparent"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <Container className="py-6">
        <Link to={ROUTES.EQUIPMENT} className="flex items-center gap-2 text-xl font-semibold">
          <ArrowLeft className="h-5 w-5" />
          <span>Înapoi</span>
        </Link>
        <p className="text-muted-foreground text-sm">Echipament negăsit.</p>
      </Container>
    );
  }

  const rawMetadata = (data.metadata as Record<string, unknown>) || {};
  const {
    cpu: rawCpu,
    ram: rawRam,
    stocare: rawStocare,
    storage: rawStorage,
    os: rawOs,
    versiuneFirmware: rawVersiuneFirmware,
    firmwareVersion: rawFirmwareVersion,
    numarInventar: rawNumarInventar,
    inventoryNumber: rawInventoryNumber,
    dataAchizitie: rawDataAchizitie,
    purchaseDate: rawPurchaseDate,
    garantie: rawGarantie,
    warranty: rawWarranty,
    ...remainingMetadata
  } = rawMetadata as Record<string, unknown>;

  const dedicated = {
    cpu: data.cpu ?? (rawCpu as string),
    ram: data.ram ?? (rawRam as string),
    stocare: data.stocare ?? (rawStocare as string) ?? (rawStorage as string),
    os: data.os ?? (rawOs as string),
    versiuneFirmware:
      data.versiuneFirmware ?? ((rawVersiuneFirmware as string) || (rawFirmwareVersion as string)),
    numarInventar:
      data.numarInventar ?? ((rawNumarInventar as string) || (rawInventoryNumber as string)),
    dataAchizitie:
      data.dataAchizitie ?? ((rawDataAchizitie as string) || (rawPurchaseDate as string)),
    garantie: data.garantie ?? ((rawGarantie as string) || (rawWarranty as string)),
  };
  
  const dedicatedEntries = [
    { key: 'CPU', value: dedicated.cpu },
    { key: 'RAM', value: dedicated.ram },
    { key: 'Stocare', value: dedicated.stocare },
    { key: 'OS', value: dedicated.os },
    { key: 'Versiune firmware', value: dedicated.versiuneFirmware },
    { key: 'Număr inventar', value: dedicated.numarInventar },
    { key: 'Dată achiziție', value: dedicated.dataAchizitie },
    { key: 'Garanție', value: dedicated.garantie },
  ].filter((e) => e.value);

  const meta = data.meta || {};
  const statusLabel = EQUIPMENT_STATUS_LABELS[data.stare] ?? data.stare;
  const statusTone =
    data.stare === 'alocat'
      ? 'info'
      : data.stare === 'in_stoc'
        ? 'success'
        : data.stare === 'mentenanta'
          ? 'warning'
          : 'neutral';

  const formatDateValue = (value?: string | Date | null) => {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return String(value);
    }
    return date.toLocaleDateString('ro-RO');
  };

  const quickFacts = [
    { label: 'Număr inventar', value: dedicated.numarInventar },
    { label: 'Dată achiziție', value: formatDateValue(dedicated.dataAchizitie) },
    { label: 'Garanție', value: formatDateValue(dedicated.garantie) },
  ].filter((item) => item.value);

  const hardwareHighlights = [
    { label: 'CPU', value: dedicated.cpu },
    { label: 'Memorie', value: dedicated.ram },
    { label: 'Stocare', value: dedicated.stocare },
    { label: 'Sistem de operare', value: dedicated.os },
  ].filter((item) => item.value);

  const assignedEmployeeName = data.angajat?.numeComplet;
  const assignedEmployeeLink = data.angajat?.id
    ? `${ROUTES.COLEGI}?highlight=${data.angajat.id}`
    : null;

  return (
    <>
      <div className="relative isolate overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.35),_transparent_55%)] opacity-60" />
        <Container className="relative py-10">
          <Link
            to={ROUTES.EQUIPMENT}
            className="flex items-center gap-2 text-sm text-white/80 transition hover:text-white hover:underline"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            <span>Înapoi la echipamente</span>
          </Link>
          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-wide text-white/70">
                <span className="rounded-full border border-white/30 px-3 py-1">
                  {data.tip}
                </span>
                <StatusBadge
                  label={statusLabel}
                  tone={statusTone}
                  withDot
                  className="border-white/40 bg-white/15 text-white backdrop-blur"
                />
              </div>
              <div className="space-y-1">
                <h1 className="text-3xl font-semibold leading-tight">{data.nume}</h1>
                <p className="text-white/70 text-sm">Serie: {data.serie}</p>
              </div>
              {assignedEmployeeName ? (
                <p className="text-white/80 text-sm">
                  Predat către{' '}
                  {assignedEmployeeLink ? (
                    <Link to={assignedEmployeeLink} className="font-medium text-white hover:underline">
                      {assignedEmployeeName}
                    </Link>
                  ) : (
                    <span className="font-medium">{assignedEmployeeName}</span>
                  )}
                </p>
              ) : (
                <p className="text-white/70 text-sm">Echipament neasignat</p>
              )}
            </div>
          </div>
        </Container>
      </div>

      <Container className="-mt-12 space-y-8 pb-12">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold">Informații esențiale</h2>
                  <p className="text-muted-foreground text-sm">
                    Rezumat al atributelor principale ale echipamentului.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {quickFacts.length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                      Nu există informații suplimentare disponibile.
                    </p>
                  ) : (
                    quickFacts.map((item) => (
                      <div key={item.label} className="rounded-xl border border-slate-200/70 p-4">
                        <p className="text-muted-foreground text-xs uppercase tracking-wide">
                          {item.label}
                        </p>
                        <p className="text-base font-medium text-slate-900 dark:text-slate-100">
                          {item.value as string}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </Card>

            <EquipmentAlerts meta={meta} stare={data.stare} />

            <ImageGallery id={id!} images={data.images || []} refetch={refetch} />

            <Card className="p-6">
              <Tabs defaultValue="detalii" className="space-y-4">
                <TabsList className="flex flex-wrap gap-2">
                  {dedicatedEntries.length > 0 && <TabsTrigger value="detalii">Detalii</TabsTrigger>}
                  {Object.keys(remainingMetadata).length > 0 && (
                    <TabsTrigger value="metadata">Metadata</TabsTrigger>
                  )}
                  <TabsTrigger value="documente">Documente</TabsTrigger>
                  <TabsTrigger value="codqr">Cod QR</TabsTrigger>
                  <TabsTrigger value="istoric">Istoric</TabsTrigger>
                </TabsList>
                {dedicatedEntries.length > 0 && (
                  <TabsContent value="detalii" className="space-y-4">
                    <h2 className="text-lg font-semibold">Detalii hardware</h2>
                    <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2 md:grid-cols-3">
                      {dedicatedEntries.map(({ key, value }) => (
                        <div key={key} className="rounded-xl border border-slate-200/70 p-4">
                          <p className="text-muted-foreground text-xs uppercase tracking-wide">{key}</p>
                          <p className="text-slate-900 dark:text-slate-100">{String(value)}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                )}
                {Object.keys(remainingMetadata).length > 0 && (
                  <TabsContent value="metadata" className="space-y-4">
                    <h2 className="text-lg font-semibold">Metadata tehnică</h2>
                    <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2 md:grid-cols-3">
                      {flattenMetadata(remainingMetadata).map(([key, value]) => (
                        <div key={key} className="rounded-xl border border-slate-200/70 p-4">
                          <p className="text-muted-foreground text-xs uppercase tracking-wide">{key}</p>
                          <p className="text-slate-900 dark:text-slate-100">{value}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                )}
                <TabsContent value="documente">
                  <DocumentSection id={id!} documents={data.documents || []} refetch={refetch} />
                </TabsContent>
                <TabsContent value="codqr">
                  <QRCodeSection id={id!} />
                </TabsContent>
                <HistoryList id={id!} />
              </Tabs>
            </Card>
          </div>

          <aside className="space-y-6 lg:col-span-4">
            <Card className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">Stare și alocare</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wide">Status</p>
                  <StatusBadge label={statusLabel} tone={statusTone} withDot />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wide">Asignat către</p>
                  {assignedEmployeeName ? (
                    assignedEmployeeLink ? (
                      <Link to={assignedEmployeeLink} className="text-primary font-medium hover:underline">
                        {assignedEmployeeName}
                      </Link>
                    ) : (
                      <span className="font-medium text-slate-900 dark:text-slate-100">{assignedEmployeeName}</span>
                    )
                  ) : (
                    <span className="text-muted-foreground">Neasignat</span>
                  )}
                </div>
              </div>
            </Card>

            {hardwareHighlights.length > 0 && (
              <Card className="p-6 space-y-4">
                <h2 className="text-lg font-semibold">Specificatii rapide</h2>
                <div className="grid gap-3 text-sm">
                  {hardwareHighlights.map((item) => (
                    <div key={item.label} className="flex justify-between gap-4">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-medium text-right text-slate-900 dark:text-slate-100">
                        {item.value as string}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            <Card className="p-6 space-y-3">
              <h2 className="text-lg font-semibold">Acțiuni rapide</h2>
              <div className="flex flex-col gap-2">
                <Button className="w-full" onClick={() => setShowEdit(true)}>
                  Editează detalii
                </Button>
                <Button className="w-full" variant="outline" onClick={() => setShowReassign(true)}>
                  Reasignare echipament
                </Button>
                <Button className="w-full" variant="destructive" onClick={() => setConfirmDefect(true)}>
                  Marchează ca defect
                </Button>
                <Button className="w-full" asChild variant="secondary">
                  <Link to={ROUTES.EMPLOYEE_FORM}>Generează fișă</Link>
                </Button>
              </div>
            </Card>
          </aside>
        </div>
      </Container>
      {showEdit && (
        <ModalEditEchipament
          echipament={data}
          onClose={() => setShowEdit(false)}
          onUpdated={() => {
            setShowEdit(false);
            refetch();
          }}
        />
      )}
      {showReassign && (
        <ModalPredaEchipament
          echipament={data}
          onClose={() => setShowReassign(false)}
          onSubmit={(eq) => handleReassignSubmit(eq as Echipament)}
        />
      )}
      <ConfirmDialog
        open={confirmDefect}
        message="Sigur dorești să marchezi acest echipament ca defect?"
        onCancel={() => setConfirmDefect(false)}
        onConfirm={handleMarkDefect}
      />
    </>
  );
}