import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCreateAngajat } from '@/features/employees';
import { useTranslation } from 'react-i18next';

export default function EmployeeForm() {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    nume: '',
    prenume: '',
    departament: '',
    dataAngajare: '',
  });
  const [errorKey, setErrorKey] = useState('');
  const [successKey, setSuccessKey] = useState('');
  const mutation = useCreateAngajat();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorKey('');
    setSuccessKey('');
    if (!form.nume || !form.departament) {
      setErrorKey('employeeForm.errors.required');
      return;
    }
    try {
      await mutation.mutateAsync({
        numeComplet: `${form.nume} ${form.prenume}`.trim(),
        functie: form.departament,
        dataAngajare: new Date(form.dataAngajare),
      });
      setSuccessKey('employeeForm.success.save');
      setForm({ nume: '', prenume: '', departament: '', dataAngajare: '' });
    } catch {
      setErrorKey('employeeForm.errors.save');
    }
  };

  return (
    <div className="mx-auto max-w-md py-4">
      <h1 className="mb-4 text-xl font-bold">{t('employeeForm.heading')}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="nume"
          placeholder={t('employeeForm.labels.lastName')}
          value={form.nume}
          onChange={handleChange}
        />
        <Input
          name="prenume"
          placeholder={t('employeeForm.labels.firstName')}
          value={form.prenume}
          onChange={handleChange}
        />
        <Input
          name="departament"
          placeholder={t('employeeForm.labels.department')}
          value={form.departament}
          onChange={handleChange}
        />
        <Input
          name="dataAngajare"
          type="date"
          value={form.dataAngajare}
          onChange={handleChange}
          placeholder={t('employeeForm.labels.hireDate')}
        />
        {errorKey && <p className="text-sm text-red-500">{t(errorKey)}</p>}
        {successKey && <p className="text-sm text-green-600">{t(successKey)}</p>}
        <Button type="submit">{t('employeeForm.buttons.save')}</Button>
      </form>
    </div>
  );
}
