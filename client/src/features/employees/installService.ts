import { getAngajat } from "./angajatiService";

export const getInstallChecklist = async (id: string) => {
  const res = await getAngajat(id);
  return {
    licenses: res.data.licenses || [],
    requirements: res.data.checklist || [],
  };
};