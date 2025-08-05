import { useParams } from 'react-router-dom';
import Container from '@/components/Container';
import { useEchipament, EQUIPMENT_STATUS_LABELS } from '@/features/equipment';

export default function EquipmentDetail() {
  const { id } = useParams();
  const { data, isLoading } = useEchipament(id || '');

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
        <p className="text-sm text-muted-foreground">Echipament negăsit.</p>
      </Container>
    );
  }

  return (
    <Container className="space-y-4 py-6">
      <div>
        <h1 className="text-2xl font-semibold">{data.nume}</h1>
        <p className="text-sm text-muted-foreground">Serie: {data.serie}</p>
      </div>
      <div className="space-y-1 text-sm">
        <p>Tip: {data.tip}</p>
        <p>Stare: {EQUIPMENT_STATUS_LABELS[data.stare] ?? data.stare}</p>
        {data.angajat && <p>Predat la: {data.angajat.numeComplet}</p>}
      </div>
      {data.metadata && (
        <div>
          <h2 className="mb-2 font-medium">Metadata</h2>
          <pre className="bg-muted rounded p-4 text-sm">
{JSON.stringify(data.metadata, null, 2)}
          </pre>
        </div>
      )}
    </Container>
  );
}