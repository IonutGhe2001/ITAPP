import { Fragment } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import Container from '@/components/Container';
import { Card } from '@/components/ui/card';
import { useEchipament, EQUIPMENT_STATUS_LABELS } from '@/features/equipment';
import { ROUTES } from '@/constants/routes';
import { QUERY_KEYS } from '@/constants/queryKeys';
import http from '@/services/http';

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
  const { data, isLoading } = useEchipament(id || '');
  const { data: history = [] } = useQuery<EquipmentChange[]>({
    queryKey: [...QUERY_KEYS.EQUIPMENT, id || '', 'history'],
    queryFn: () => http.get<EquipmentChange[]>(`/equipment-changes/history/${id}`),
    enabled: !!id,
  });

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
    stocare:
      data.stocare ??
      ((rawMetadata.stocare as string) ?? (rawMetadata.storage as string)),
    os: data.os ?? (rawMetadata.os as string),
    versiuneFirmware:
      data.versiuneFirmware ??
      ((rawMetadata.versiuneFirmware as string) ||
        (rawMetadata.firmwareVersion as string)),
    numarInventar:
      data.numarInventar ??
      ((rawMetadata.numarInventar as string) ||
        (rawMetadata.inventoryNumber as string)),
    dataAchizitie:
      data.dataAchizitie ??
      ((rawMetadata.dataAchizitie as string) ||
        (rawMetadata.purchaseDate as string)),
    garantie:
      data.garantie ??
      ((rawMetadata.garantie as string) || (rawMetadata.warranty as string)),
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

  return (
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
  );
}