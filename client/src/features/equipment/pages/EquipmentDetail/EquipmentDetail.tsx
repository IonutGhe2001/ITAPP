import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Container from '@/components/Container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
    stocare:
      data.stocare ?? (rawStocare as string) ?? (rawStorage as string),
    os: data.os ?? (rawOs as string),
    versiuneFirmware:
      data.versiuneFirmware ??
      ((rawVersiuneFirmware as string) || (rawFirmwareVersion as string)),
    numarInventar:
      data.numarInventar ??
      ((rawNumarInventar as string) || (rawInventoryNumber as string)),
    dataAchizitie:
      data.dataAchizitie ??
      ((rawDataAchizitie as string) || (rawPurchaseDate as string)),
    garantie:
      data.garantie ?? ((rawGarantie as string) || (rawWarranty as string)),
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

  return (
    <>
      <Container className="space-y-6 py-6">
        <div className="flex items-center gap-2">
          <Link to={ROUTES.EQUIPMENT}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold">{data.nume}</h1>
            <p className="text-muted-foreground text-sm">Serie: {data.serie}</p>
          </div>
        </div>
        <div className="space-y-1 text-sm">
          <p>Tip: {data.tip}</p>
          <p>Stare: {EQUIPMENT_STATUS_LABELS[data.stare] ?? data.stare}</p>
          {data.angajat && <p>Predat la: {data.angajat.numeComplet}</p>}
        </div>
        <EquipmentAlerts meta={meta} stare={data.stare} />
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setShowEdit(true)}>Editează</Button>
          <Button variant="outline" onClick={() => setShowReassign(true)}>
            Reasignare
          </Button>
          <Button variant="destructive" onClick={() => setConfirmDefect(true)}>
            Marcare defect
          </Button>
          <Button asChild variant="secondary">
            <Link to={ROUTES.EMPLOYEE_FORM}>Generare fișă</Link>
          </Button>
        </div>
        
        <ImageGallery id={id!} images={data.images || []} refetch={refetch} />
        <Tabs defaultValue="detalii" className="space-y-6">
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
            <TabsContent value="detalii">
              <div className="space-y-4">
                <h2 className="font-medium">Detalii</h2>
                <Card className="p-4">
                  <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2 md:grid-cols-3">
                    {dedicatedEntries.map(({ key, value }) => (
                      <div key={key} className="grid grid-cols-[auto,1fr] gap-2">
                        <span className="font-medium">{key}</span>
                        <span className="text-muted-foreground">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>
          )}
          {Object.keys(remainingMetadata).length > 0 && (
            <TabsContent value="metadata">
              <div className="space-y-4">
                <h2 className="font-medium">Metadata</h2>
                <Card className="p-4">
                  <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2 md:grid-cols-3">
                    {flattenMetadata(remainingMetadata).map(([key, value]) => (
                      <div key={key} className="grid grid-cols-[auto,1fr] gap-2">
                        <span className="font-medium">{key}</span>
                        <span className="text-muted-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                </Card>
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