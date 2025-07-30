import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Dispatch, SetStateAction } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Angajat } from '@/features/equipment/types'
import type { EchipamentFormData } from '@/pages/Dashboard/modals/useEchipamentForm'

export interface EchipamentFormProps {
 formData: EchipamentFormData
  setFormData: Dispatch<SetStateAction<EchipamentFormData>>
  errors: Record<string, string>
  search: string
  setSearch: (s: string) => void
  angajati: Angajat[]
  onAddColeg: () => void
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
  return (
    <div className="space-y-4">
      {errors.general && (
        <p className="text-sm text-red-500">{errors.general}</p>
      )}
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
        />
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
      <div>
        <Label>Detalii (opțional)</Label>
        <textarea
          className="border border-gray-300 rounded-lg w-full p-2 text-sm"
          value={formData.metadata}
          onChange={(e) => setFormData({ ...formData, metadata: e.target.value })}
        />
      </div>
      <div>
        <Label>Angajat</Label>
        <Select
          value={formData.angajatId}
          onValueChange={(value) => setFormData({ ...formData, angajatId: value })}
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
            <SelectItem value="none">Neatribuit</SelectItem>
            {angajati
              .filter((a) => a.numeComplet.toLowerCase().includes(search.toLowerCase()))
              .map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.numeComplet}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <button
          type="button"
          onClick={onAddColeg}
          className="text-xs text-primary mt-1 hover:underline"
        >
          Adaugă coleg nou
        </button>
        {errors.angajatId && (
          <p className="text-sm text-red-500 mt-1">{errors.angajatId}</p>
        )}
      </div>
    </div>
  )
}