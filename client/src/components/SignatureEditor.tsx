import { useRef, useState } from "react";
import { Pencil, X } from "lucide-react";
import SignaturePad, { type SignaturePadHandle } from "@/components/SignaturePad";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
          className="w-32 max-h-32 object-contain border border-border"
        />
      ) : (
        <div className="w-32 h-32 flex items-center justify-center border border-dashed text-muted-foreground">
          Fără semnătură
        </div>
      )}
      {isEditing && (
        <>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full cursor-pointer shadow"
          >
            <Pencil size={16} />
          </button>
          {signature && (
            <button
              type="button"
              onClick={remove}
              className="absolute top-0 right-0 bg-destructive text-destructive-foreground p-1 rounded-full shadow"
            >
              <X size={14} />
            </button>
          )}
        </>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <SignaturePad ref={padRef} />
          <div className="flex justify-end gap-2 mt-4">
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