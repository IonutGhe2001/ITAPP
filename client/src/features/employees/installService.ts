import { getAngajat } from './angajatiService';

export const getInstallChecklist = async (id: string) => {
  const angajat = await getAngajat(id);
  return {
    licenses: (angajat as any).licenses || [],
    requirements: (angajat as any).checklist || [],
  };
};
