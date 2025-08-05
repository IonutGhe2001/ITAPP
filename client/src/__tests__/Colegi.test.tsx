import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import Colegi from '../features/employees/pages/Colegi/Colegi';
import ColegRow from '../features/employees/pages/Colegi/ColegRow';
import ModalCreateEmail from '../features/employees/pages/Colegi/ModalCreateEmail';

vi.mock('@/features/employees', () => ({
  useAngajati: () => ({ data: [], refetch: vi.fn() }),
  useDeleteAngajat: () => ({ mutateAsync: vi.fn() }),
  useUpdateAngajat: () => ({ mutate: vi.fn() }),
  useCreateEmailAccount: () => ({ mutateAsync: vi.fn() }),
}));

vi.mock('@/features/equipment', () => ({
  useUpdateEchipament: () => ({ mutateAsync: vi.fn() }),
  EquipmentIcon: () => null,
}));

vi.mock('@/features/proceseVerbale', () => ({
  genereazaProcesVerbal: vi.fn(),
}));

vi.mock('@/services/configService', () => ({
  getConfig: vi.fn().mockResolvedValue({ pvGenerationMode: 'auto' }),
}));

vi.mock('@/features/proceseVerbale/pvQueue', () => ({
  queueProcesVerbal: vi.fn(),
  getQueue: () => [],
  removeFromQueue: vi.fn(),
}));

vi.mock('@/hooks/use-toast/use-toast-hook', () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

describe('Colegi', () => {
  it('renders search input', () => {
    render(
      <MemoryRouter>
        <Colegi />
      </MemoryRouter>
    );
    expect(screen.getByPlaceholderText('Caută după nume sau funcție')).toBeInTheDocument();
  });
  
  it('shows mark email button only when status is pending', () => {
    const coleg = {
      id: '1',
      numeComplet: 'Test User',
      functie: 'Dev',
      email: 'test@example.com',
      telefon: '123',
      cDataCreated: false,
      emailAccountStatus: 'PENDING' as const,
      echipamente: [],
    };
    const { rerender } = render(
      <ColegRow
        coleg={coleg}
        index={0}
        style={{}}
        expanded={false}
        toggleExpand={vi.fn()}
        handleRemoveEquipment={vi.fn()}
        setEditColeg={vi.fn()}
        setConfirmDelete={vi.fn()}
        handleDelete={vi.fn()}
        setSelectedAngajatId={vi.fn()}
        setReplaceData={vi.fn()}
        setSize={vi.fn()}
        pendingPV={undefined}
        onGeneratePV={vi.fn()}
        setCreateEmail={vi.fn()}
      />
    );
    expect(screen.getByText('Marchează cont e-mail creat')).toBeInTheDocument();

    const colegCreated = { ...coleg, emailAccountStatus: 'CREATED' as const };
    rerender(
      <ColegRow
        coleg={colegCreated}
        index={0}
        style={{}}
        expanded={false}
        toggleExpand={vi.fn()}
        handleRemoveEquipment={vi.fn()}
        setEditColeg={vi.fn()}
        setConfirmDelete={vi.fn()}
        handleDelete={vi.fn()}
        setSelectedAngajatId={vi.fn()}
        setReplaceData={vi.fn()}
        setSize={vi.fn()}
        pendingPV={undefined}
        onGeneratePV={vi.fn()}
        setCreateEmail={vi.fn()}
      />
    );
    expect(screen.queryByText('Marchează cont e-mail creat')).not.toBeInTheDocument();
  });

  it('prefills email and requires responsible on mark form', async () => {
    const coleg = {
      id: '1',
      numeComplet: 'Test User',
      functie: 'Dev',
      email: 'test@example.com',
      telefon: '123',
      cDataCreated: false,
      echipamente: [],
    };
    const onSuccess = vi.fn();
    render(<ModalCreateEmail coleg={coleg} onClose={vi.fn()} onSuccess={onSuccess} />);

    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Marchează'));
    expect(screen.getByText('Responsabilul este necesar.')).toBeInTheDocument();
  });
});