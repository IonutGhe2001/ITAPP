import { Alert } from '@/components/ui/alert';
import { AlertTriangle, Clock } from 'lucide-react';
import type { JSX } from 'react';

const AGE_WARNING_YEARS = 3;
const WARRANTY_SOON_DAYS = 30;
const DEFECT_WARNING_DAYS = 30;

interface Meta {
  ageYears?: number;
  warrantyDaysLeft?: number;
  defectDays?: number;
}

interface Props {
  meta: Meta;
  stare: string;
}

export default function EquipmentAlerts({ meta, stare }: Props): JSX.Element | null {
  const alerts: JSX.Element[] = [];

  if (meta.ageYears !== undefined && meta.ageYears >= AGE_WARNING_YEARS) {
    alerts.push(
      <Alert variant="warning" icon={<Clock className="h-4 w-4" aria-hidden="true" />} key="age">
        Vechime {meta.ageYears} ani
      </Alert>
    );
  }

  if (meta.warrantyDaysLeft !== undefined) {
    if (meta.warrantyDaysLeft <= 0) {
      alerts.push(
        <Alert
          variant="destructive"
          icon={<AlertTriangle className="h-4 w-4" aria-hidden="true" />}
          key="warranty"
        >
          Garanție expirată
        </Alert>
      );
    } else if (meta.warrantyDaysLeft <= WARRANTY_SOON_DAYS) {
      alerts.push(
        <Alert
          variant="warning"
          icon={<Clock className="h-4 w-4" aria-hidden="true" />}
          key="warranty-soon"
        >
          Garanția expiră în {meta.warrantyDaysLeft} zile
        </Alert>
      );
    }
  }

  if (meta.defectDays !== undefined && stare === 'mentenanta') {
    const variant = meta.defectDays > DEFECT_WARNING_DAYS ? 'destructive' : 'warning';
    alerts.push(
      <Alert
        variant={variant}
        icon={<AlertTriangle className="h-4 w-4" aria-hidden="true" />}
        key="defect"
      >
        Defect de {meta.defectDays} zile
      </Alert>
    );
  }

  if (alerts.length === 0) return null;

  return <div className="flex flex-wrap gap-2">{alerts}</div>;
}
