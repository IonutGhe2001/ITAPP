import { useState, useEffect } from 'react';

export interface EchipamentFormData {
  nume: string;
  serie: string;
  tip: string;
  angajatId: string;
  metadata: string;
  simOperator: string;
  simSerie: string;
  simExpirare: string;
}

export function useEchipamentForm(initial?: Partial<EchipamentFormData>) {
  const [formData, setFormData] = useState<EchipamentFormData>({
    nume: '',
    serie: '',
    tip: '',
    angajatId: 'none',
    metadata: '',
    simOperator: '',
    simSerie: '',
    simExpirare: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [search, setSearch] = useState('');
  const [showColegModal, setShowColegModal] = useState(false);

  useEffect(() => {
    if (initial) {
      let metadataStr = '';
      let simOperator = '';
      let simSerie = '';
      let simExpirare = '';
      if (initial.metadata) {
        let metaObj: any = {};
        if (typeof initial.metadata === 'string') {
          try {
            metaObj = JSON.parse(initial.metadata);
          } catch {
            metadataStr = initial.metadata;
          }
        } else if (typeof initial.metadata === 'object') {
          metaObj = initial.metadata as any;
        }
        if (metaObj && metaObj.sim) {
          simOperator = metaObj.sim.operator ?? '';
          simSerie = metaObj.sim.serie ?? '';
          simExpirare = metaObj.sim.expirationDate ?? '';
          delete metaObj.sim;
        }
        if (!metadataStr && metaObj && Object.keys(metaObj).length > 0) {
          metadataStr = JSON.stringify(metaObj);
        }
      }
      setFormData({
        nume: initial.nume ?? '',
        serie: initial.serie ?? '',
        tip: initial.tip ?? '',
        angajatId: initial.angajatId ?? 'none',
        metadata: metadataStr,
        simOperator,
        simSerie,
        simExpirare,
      });
    }
  }, [initial]);

  const validate = (msgs: { nume: string; serie: string; tip: string }) => {
    const newErrors: Record<string, string> = {};
    if (!formData.nume.trim()) newErrors.nume = msgs.nume;
    if (!formData.serie.trim()) newErrors.serie = msgs.serie;
    if (!formData.tip.trim()) newErrors.tip = msgs.tip;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildPayload = () => {
    let metadata: any = {};
    if (formData.metadata.trim()) {
      try {
        metadata = JSON.parse(formData.metadata);
      } catch {
        metadata.extra = formData.metadata;
      }
    }
    if (
      formData.tip.trim().toLowerCase() === 'telefon' &&
      (formData.simOperator || formData.simSerie || formData.simExpirare)
    ) {
      metadata.sim = {
        operator: formData.simOperator.trim(),
        serie: formData.simSerie.trim(),
        expirationDate: formData.simExpirare.trim(),
      };
    }
    if (Object.keys(metadata).length === 0) {
      metadata = undefined;
    }
    return {
      nume: formData.nume.trim(),
      tip: formData.tip.trim(),
      serie: formData.serie.trim(),
      angajatId: formData.angajatId === 'none' ? null : formData.angajatId,
      metadata,
    };
  };

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
  };
}
