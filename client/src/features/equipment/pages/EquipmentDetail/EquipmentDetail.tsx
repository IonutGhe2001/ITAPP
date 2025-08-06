import { Fragment, useRef, useState, type JSX } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import Container from '@/components/Container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  useEchipament,
  EQUIPMENT_STATUS_LABELS,
  useUpdateEchipament,
  ModalEditEchipament,
  ModalPredaEchipament,
} from '@/features/equipment';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ROUTES } from '@/constants/routes';
import { QUERY_KEYS } from '@/constants/queryKeys';
import http from '@/services/http';
import { QRCodeCanvas } from 'qrcode.react';
import type { Echipament } from '@/features/equipment';
const apiBase = (import.meta.env.VITE_API_URL || '/api').replace(/\/api$/, '');
const AGE_WARNING_YEARS = 3;
const WARRANTY_SOON_DAYS = 30;
const DEFECT_WARNING_DAYS = 30;

type EquipmentChange = {
  id: string;
  tip: 'ASSIGN' | 'RETURN' | 'REPLACE';
  createdAt: string;
  angajat?: { numeComplet: string };
};

const EQUIPMENT_CHANGE_LABELS: Record<EquipmentChange['tip'], string> = {
  ASSIGN: 'Predare',
  RETURN: 'Returnare',
  REPLACE: 'Înlocuire',
};

function flattenMetadata(metadata: Record<string, unknown>, prefix = ''): [string, string][] {
  return Object.entries(metadata).flatMap(([key, value]) => {
    const prefixedKey = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return flattenMetadata(value as Record<string, unknown>, prefixedKey);
    }

    if (Array.isArray(value)) {
      return [
        [
          prefixedKey,
          value
            .map((item) => (item && typeof item === 'object' ? JSON.stringify(item) : String(item)))
            .join(', '),
        ],
      ];
    }

    return [[prefixedKey, String(value)]];
  });
}

export default function EquipmentDetail() {
  const { id } = useParams();
  const { data, isLoading, refetch } = useEchipament(id || '');
  const updateMutation = useUpdateEchipament();
  const [showEdit, setShowEdit] = useState(false);
  const [showReassign, setShowReassign] = useState(false);
  const [confirmDefect, setConfirmDefect] = useState(false);

  const { data: history = [] } = useQuery<EquipmentChange[]>({
    queryKey: [...QUERY_KEYS.EQUIPMENT, id || '', 'history'],
    queryFn: () => http.get<EquipmentChange[]>(`/equipment-changes/history/${id}`),
    enabled: !!id,
  });

  const qrRef = useRef<HTMLDivElement>(null);
  const handleReassignSubmit = async (eq: Echipament) => {
    await updateMutation.mutateAsync({
      id: eq.id,
      data: { angajatId: eq.angajatId, stare: eq.stare },
    });
    setShowReassign(false);
    refetch();
  };

  const handleMarkDefect = async () => {
    if (!id) return;
    await updateMutation.mutateAsync({ id, data: { stare: 'mentenanta' } });
    setConfirmDefect(false);
    refetch();
  };
  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = `equipment-${id}-qr.png`;
    link.click();
  };

  const handlePrint = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`<img src="${url}" style="width:100%" />`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
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
  const dedicated = {
    cpu: data.cpu ?? (rawMetadata.cpu as string),
    ram: data.ram ?? (rawMetadata.ram as string),
    stocare: data.stocare ?? (rawMetadata.stocare as string) ?? (rawMetadata.storage as string),
    os: data.os ?? (rawMetadata.os as string),
    versiuneFirmware:
      data.versiuneFirmware ??
      ((rawMetadata.versiuneFirmware as string) || (rawMetadata.firmwareVersion as string)),
    numarInventar:
      data.numarInventar ??
      ((rawMetadata.numarInventar as string) || (rawMetadata.inventoryNumber as string)),
    dataAchizitie:
      data.dataAchizitie ??
      ((rawMetadata.dataAchizitie as string) || (rawMetadata.purchaseDate as string)),
    garantie:
      data.garantie ?? ((rawMetadata.garantie as string) || (rawMetadata.warranty as string)),
  };

  const remainingMetadata = { ...rawMetadata } as Record<string, unknown>;
  [
    'cpu',
    'ram',
    'stocare',
    'storage',
    'os',
    'versiuneFirmware',
    'firmwareVersion',
    'numarInventar',
    'inventoryNumber',
    'dataAchizitie',
    'purchaseDate',
    'garantie',
    'warranty',
  ].forEach((key) => {
    delete (remainingMetadata as Record<string, unknown>)[key];
  });

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
  const alerts: JSX.Element[] = [];

  if (meta.ageYears !== undefined && meta.ageYears >= AGE_WARNING_YEARS) {
    alerts.push(
      <Badge variant="destructive" className="flex items-center gap-1" key="age">
        <Clock className="h-3 w-3" /> Vechime {meta.ageYears} ani
      </Badge>
    );
  }

  if (meta.warrantyDaysLeft !== undefined) {
    if (meta.warrantyDaysLeft <= 0) {
      alerts.push(
        <Badge variant="destructive" className="flex items-center gap-1" key="warranty">
          <AlertTriangle className="h-3 w-3" /> Garanție expirată
        </Badge>
      );
    } else if (meta.warrantyDaysLeft <= WARRANTY_SOON_DAYS) {
      alerts.push(
        <Badge variant="secondary" className="flex items-center gap-1" key="warranty-soon">
          <Clock className="h-3 w-3" /> Garanția expiră în {meta.warrantyDaysLeft} zile
        </Badge>
      );
    }
  }

  if (meta.defectDays !== undefined && data.stare === 'mentenanta') {
    const variant = meta.defectDays > DEFECT_WARNING_DAYS ? 'destructive' : 'secondary';
    alerts.push(
      <Badge variant={variant} className="flex items-center gap-1" key="defect">
        <AlertTriangle className="h-3 w-3" /> Defect de {meta.defectDays} zile
      </Badge>
    );
  }

  return (
    <>
      <Container className="space-y-4 py-6">
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
      {alerts.length > 0 && <div className="flex flex-wrap gap-2 pt-2">{alerts}</div>}
        <div className="flex flex-wrap gap-2 pt-2">
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
        {data.images && data.images.length > 0 ? (
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            {data.images.map((img) => (
              <img
                key={img.id}
                src={`${apiBase}${img.url}`}
                alt={data.nume}
                className="h-40 w-full rounded object-cover"
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">Nu există imagini disponibile.</p>
        )}
        {dedicatedEntries.length > 0 && (
          <div>
            <h2 className="mb-2 font-medium">Detalii</h2>
            <Card className="p-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                {dedicatedEntries.map(({ key, value }) => (
                  <Fragment key={key}>
                    <span className="font-medium">{key}</span>
                    <span className="text-muted-foreground">{String(value)}</span>
                  </Fragment>
                ))}
              </div>
            </Card>
          </div>
        )}
        {Object.keys(remainingMetadata).length > 0 && (
          <div>
            <h2 className="mb-2 font-medium">Metadata</h2>
            <Card className="p-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                {flattenMetadata(remainingMetadata).map(([key, value]) => (
                  <Fragment key={key}>
                    <span className="font-medium">{key}</span>
                    <span className="text-muted-foreground">{value}</span>
                  </Fragment>
                ))}
              </div>
            </Card>
          </div>
        )}
        {data.documents && data.documents.length > 0 && (
          <div>
            <h2 className="mb-2 font-medium">Documente</h2>
            <Card className="p-4">
              <ul className="space-y-2 text-sm">
                {data.documents.map((doc) => (
                  <li key={doc.id} className="flex justify-between">
                    <span>{doc.name}</span>
                    <a
                      href={`${apiBase}${doc.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      Vezi
                    </a>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        )}
        <div>
          <h2 className="mb-2 font-medium">Cod QR</h2>
          <Card className="flex flex-col items-center gap-4 p-4">
            <div ref={qrRef}>
              <QRCodeCanvas value={window.location.href} size={128} />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleDownload}>Descarcă</Button>
              <Button variant="outline" onClick={handlePrint}>
                Printează
              </Button>
            </div>
          </Card>
        </div>
       {history.length > 0 && (
          <div>
            <h2 className="mb-2 font-medium">Istoric</h2>
            <Card className="p-4">
              <ul className="space-y-2 text-sm">
                {history.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span>
                      {EQUIPMENT_CHANGE_LABELS[item.tip]}
                      {item.angajat?.numeComplet && ` - ${item.angajat.numeComplet}`}
                    </span>
                    <span className="text-muted-foreground">
                      {new Date(item.createdAt).toLocaleString('ro-RO')}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        )}
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
      {confirmDefect && (
        <Dialog open onOpenChange={setConfirmDefect}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmare defect</DialogTitle>
            </DialogHeader>
            <p className="text-muted-foreground text-sm">
              Sigur dorești să marchezi acest echipament ca defect?
            </p>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setConfirmDefect(false)}>
                Anulează
              </Button>
              <Button variant="destructive" onClick={handleMarkDefect}>
                Confirmă
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}