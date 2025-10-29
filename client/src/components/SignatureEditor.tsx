import { useRef, useState } from 'react';
import { Pencil, X } from 'lucide-react';
import SignaturePad, { type SignaturePadHandle } from '@/components/SignaturePad';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface SignatureEditorProps {
  signature?: string | null;
  isEditing: boolean;
  onChange: (value: string | null) => void;
}

export default function SignatureEditor({ signature, isEditing, onChange }: SignatureEditorProps) {
  const [open, setOpen] = useState(false);
  const padRef = useRef<SignaturePadHandle>(null);

  const save = () => {
    const img = padRef.current?.getImage();
    if (img) {
      onChange(img);
    }
    setOpen(false);
  };

  const remove = () => onChange(null);

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      {signature ? (
        <img
          src={signature}
          alt="Semnătură"
          className="max-h-20 w-full max-w-[14rem] object-contain"
        />
      ) : (
        <div className="text-muted-foreground flex h-full w-full items-center justify-center text-sm">
          Fără semnătură
        </div>
      )}
      {isEditing && (
        <>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="bg-primary text-primary-foreground absolute bottom-2 right-2 rounded-full p-2 shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <Pencil size={16} />
          </button>
          {signature && (
            <button
              type="button"
              onClick={remove}
              className="bg-destructive text-destructive-foreground absolute right-2 top-2 rounded-full p-1.5 shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2"
            >
              <X size={14} />
            </button>
          )}
        </>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <SignaturePad ref={padRef} />
          <div className="mt-4 flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => padRef.current?.clear()}
              className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Curăță
            </Button>
            <Button
              type="button"
              onClick={save}
              className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Salvează
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
