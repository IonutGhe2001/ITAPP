import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import Colegi from '../features/employees/pages/Colegi/Colegi';
import ColegRow from '../features/employees/pages/Colegi/ColegRow';

vi.mock('@/features/employees', () => ({
  useAngajati: () => ({
    data: { pages: [{ data: [] }] },
    refetch: vi.fn(),
    isLoading: false,
    fetchNextPage: vi.fn(),
    hasNextPage: false,
    isFetchingNextPage: false,
  }),
  useDeleteAngajat: () => ({ mutateAsync: vi.fn() }),
  useUpdateAngajat: () => ({ mutate: vi.fn() }),
  useAllAngajati: () => ({ data: [] }),
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

vi.mock('@/context/useAuth', () => ({
  useAuth: () => ({ isAuthenticated: true, loading: false }),
}));

describe('Colegi', () => {
  it('renders search input', () => {
    render(
      <MemoryRouter>
        <Colegi />
      </MemoryRouter>
    );
    expect(screen.getByPlaceholderText('Caută după nume, rol sau departament')).toBeInTheDocument();
  });

  it('does not show mark email button when email is pending', () => {
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
    render(
      <ColegRow
        coleg={coleg}
        index={0}
        style={{}}
        setEditColeg={vi.fn()}
        setConfirmDelete={vi.fn()}
        handleDelete={vi.fn()}
        setSelectedAngajatId={vi.fn()}
        setSize={vi.fn()}
        pendingPV={undefined}
        onGeneratePV={vi.fn()}
        onOpenDetails={vi.fn()}
      />
    );
    expect(screen.queryByText('Marchează creat')).not.toBeInTheDocument();
  });
});
