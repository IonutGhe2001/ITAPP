import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Angajat } from '@/features/equipment/types';
import type { EchipamentFormData } from '@/pages/Dashboard/modals/useEchipamentForm';

export interface EchipamentFormProps {
  formData: EchipamentFormData;
  setFormData: Dispatch<SetStateAction<EchipamentFormData>>;
  errors: Record<string, string>;
  search: string;
  setSearch: (s: string) => void;
  angajati: Angajat[];
  onAddColeg: () => void;
}

export default function EchipamentForm({
  formData,
  setFormData,
  errors,
  search,
  setSearch,
  angajati,
  onAddColeg,
}: EchipamentFormProps) {
  const [selectOpen, setSelectOpen] = useState(false);
  const filteredAngajati = angajati.filter((a) =>
    a.numeComplet.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="space-y-4">
      {errors.general && <p className="text-sm text-red-500">{errors.general}</p>}
      <div>
        <Label>Nume echipament</Label>
        <Input
          value={formData.nume}
          onChange={(e) => setFormData({ ...formData, nume: e.target.value })}
        />
        {errors.nume && <p className="text-sm text-red-500">{errors.nume}</p>}
      </div>
      <div>
        <Label>Seria</Label>
        <Input
          value={formData.serie}
          onChange={(e) => setFormData({ ...formData, serie: e.target.value })}
          disabled={formData.skipSerialNumber}
          placeholder={formData.skipSerialNumber ? "Echipamentul nu are SN" : ""}
        />
        <div className="mt-2 flex items-center">
          <input
            type="checkbox"
            id="skipSerialNumber"
            checked={formData.skipSerialNumber}
            onChange={(e) => setFormData({ 
              ...formData, 
              skipSerialNumber: e.target.checked,
              serie: e.target.checked ? 'N/A' : formData.serie === 'N/A' ? '' : formData.serie
            })}
            className="mr-2 h-4 w-4 rounded border-gray-300"
          />
          <Label htmlFor="skipSerialNumber" className="text-sm font-normal cursor-pointer">
            Echipamentul nu are număr de serie
          </Label>
        </div>
        {errors.serie && <p className="text-sm text-red-500">{errors.serie}</p>}
      </div>
      <div>
        <Label>Tip</Label>
        <Input
          value={formData.tip}
          onChange={(e) => setFormData({ ...formData, tip: e.target.value })}
        />
        {errors.tip && <p className="text-sm text-red-500">{errors.tip}</p>}
      </div>
      {formData.tip.toLowerCase() === 'telefon' && (
        <>
          <div>
            <Label>Operator SIM</Label>
            <Input
              value={formData.simOperator}
              onChange={(e) => setFormData({ ...formData, simOperator: e.target.value })}
            />
          </div>
          <div>
            <Label>Seria SIM</Label>
            <Input
              value={formData.simSerie}
              onChange={(e) => setFormData({ ...formData, simSerie: e.target.value })}
            />
          </div>
          <div>
            <Label>Data expirare SIM</Label>
            <Input
              type="date"
              value={formData.simExpirare}
              onChange={(e) => setFormData({ ...formData, simExpirare: e.target.value })}
            />
          </div>
        </>
      )}
      <div>
        <Label>Detalii (opțional)</Label>
        <textarea
          className="w-full rounded-lg border border-gray-300 p-2 text-sm"
          value={formData.metadata}
          onChange={(e) => setFormData({ ...formData, metadata: e.target.value })}
        />
      </div>
      <div>
        <Label>Angajat</Label>
        <Select
          value={formData.angajatId}
          onValueChange={(value) => setFormData({ ...formData, angajatId: value })}
          open={selectOpen}
          onOpenChange={setSelectOpen}
        >
          <SelectTrigger>
            <SelectValue placeholder="Atribuie angajat (opțional)" />
          </SelectTrigger>
          <SelectContent>
            <div className="p-2">
              <Input
                placeholder="Caută..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
                className="mb-2"
              />
            </div>
            {filteredAngajati.length > 0 ? (
              <>
                <SelectItem value="none">Neatribuit</SelectItem>
                {filteredAngajati.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.numeComplet}
                  </SelectItem>
                ))}
              </>
            ) : (
              <div className="text-muted-foreground p-2 text-center text-sm">
                <p>Nu s-au găsit colegi.</p>
                <Button
                  size="sm"
                  className="mt-2 w-full"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectOpen(false);
                    onAddColeg();
                  }}
                >
                  Adaugă coleg nou
                </Button>
              </div>
            )}
          </SelectContent>
        </Select>

        {errors.angajatId && <p className="mt-1 text-sm text-red-500">{errors.angajatId}</p>}
      </div>
    </div>
  );
}
