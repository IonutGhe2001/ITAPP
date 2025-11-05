import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';

interface ConfirmDialogProps {
  open: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ open, message, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmare</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">{message}</p>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onCancel}>
            Anulează
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Confirmă
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
