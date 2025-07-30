import { useState, useEffect } from 'react'

export interface EchipamentFormData {
  nume: string
  serie: string
  tip: string
  angajatId: string
  metadata: string
}

export function useEchipamentForm(initial?: Partial<EchipamentFormData>) {
  const [formData, setFormData] = useState<EchipamentFormData>({
    nume: '',
    serie: '',
    tip: '',
    angajatId: 'none',
    metadata: '',
    ...initial,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [search, setSearch] = useState('')
  const [showColegModal, setShowColegModal] = useState(false)

  useEffect(() => {
    if (initial) {
      setFormData({
        nume: initial.nume ?? '',
        serie: initial.serie ?? '',
        tip: initial.tip ?? '',
        angajatId: initial.angajatId ?? 'none',
        metadata: initial.metadata ?? '',
      })
    }
  }, [initial])

  const validate = (msgs: { nume: string; serie: string; tip: string }) => {
    const newErrors: Record<string, string> = {}
    if (!formData.nume.trim()) newErrors.nume = msgs.nume
    if (!formData.serie.trim()) newErrors.serie = msgs.serie
    if (!formData.tip.trim()) newErrors.tip = msgs.tip
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const buildPayload = () => {
    let metadata: unknown = undefined
    if (formData.metadata.trim()) {
      try {
        metadata = JSON.parse(formData.metadata)
      } catch {
        metadata = formData.metadata
      }
    }
    return {
      nume: formData.nume.trim(),
      tip: formData.tip.trim(),
      serie: formData.serie.trim(),
      angajatId: formData.angajatId === 'none' ? null : formData.angajatId,
      metadata,
    }
  }

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    search,
    setSearch,
    showColegModal,
    setShowColegModal,
    validate,
    buildPayload,
  }
}