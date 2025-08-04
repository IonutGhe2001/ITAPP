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
    <div className="relative">
      {signature ? (
        <img
          src={signature}
          alt="Semnătură"
          className="border-border max-h-32 w-32 border object-contain"
        />
      ) : (
        <div className="text-muted-foreground flex h-32 w-32 items-center justify-center border border-dashed">
          Fără semnătură
        </div>
      )}
      {isEditing && (
        <>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="bg-primary text-primary-foreground absolute bottom-0 right-0 cursor-pointer rounded-full p-2 shadow"
          >
            <Pencil size={16} />
          </button>
          {signature && (
            <button
              type="button"
              onClick={remove}
              className="bg-destructive text-destructive-foreground absolute right-0 top-0 rounded-full p-1 shadow"
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
            <Button type="button" variant="ghost" onClick={() => padRef.current?.clear()}>
              Curăță
            </Button>
            <Button type="button" onClick={save}>
              Salvează
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
