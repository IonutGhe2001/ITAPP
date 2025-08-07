import { useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QRCodeCanvas } from 'qrcode.react';

interface Props {
  id: string;
}

export default function QRCodeSection({ id }: Props) {
  const qrRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="space-y-4">
      <h2 className="font-medium">Cod QR</h2>
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
  );
}