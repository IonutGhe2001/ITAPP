import { Fragment } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Container from '@/components/Container';
import { Card } from '@/components/ui/card';
import { useEchipament, EQUIPMENT_STATUS_LABELS } from '@/features/equipment';
import { ROUTES } from '@/constants/routes';

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
        <div className="flex items-center gap-2 text-xl font-semibold">
        <Link to={ROUTES.EQUIPMENT}>
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1>INFO: {data.nume}</h1>
      </div>
        <p className="text-muted-foreground text-sm">Echipament negăsit.</p>
      </Container>
    );
  }

  return (
    <Container className="space-y-4 py-6">
      <div>
        <h1 className="text-2xl font-semibold">{data.nume}</h1>
        <p className="text-muted-foreground text-sm">Serie: {data.serie}</p>
      </div>
      <div className="space-y-1 text-sm">
        <p>Tip: {data.tip}</p>
        <p>Stare: {EQUIPMENT_STATUS_LABELS[data.stare] ?? data.stare}</p>
        {data.angajat && <p>Predat la: {data.angajat.numeComplet}</p>}
      </div>
      {data.metadata && (
        <div>
          <h2 className="mb-2 font-medium">Metadata</h2>
          <Card className="p-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(data.metadata).map(([key, value]) => (
                <Fragment key={key}>
                  <span className="font-medium">{key}</span>
                  <span className="text-muted-foreground">{String(value)}</span>
                </Fragment>
              ))}
            </div>
          </Card>
        </div>
      )}
    </Container>
  );
}