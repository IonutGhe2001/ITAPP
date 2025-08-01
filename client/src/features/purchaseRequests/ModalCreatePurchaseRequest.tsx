import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast/use-toast-hook";
import { getApiErrorMessage } from "@/utils/apiError";
import { useCreatePurchaseRequest } from "./purchaseRequestService";

interface Props {
  equipmentType: string;
  onClose: () => void;
}

export default function ModalCreatePurchaseRequest({ equipmentType, onClose }: Props) {
  const [quantity, setQuantity] = useState(1);
  const createMutation = useCreatePurchaseRequest();
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      await createMutation.mutateAsync({ equipmentType, quantity });
      toast({
        title: "Cerere creată",
        description: "Cererea a fost înregistrată.",
      });
      onClose();
    } catch (err) {
      toast({
        title: "Eroare",
        description: getApiErrorMessage(err),
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Creează cerere de achiziție</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">Tip echipament</p>
            <p className="mt-1 text-sm">{equipmentType}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Cantitate</p>
            <Input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
            />
          </div>
          <Button onClick={handleSubmit}>Trimite</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}