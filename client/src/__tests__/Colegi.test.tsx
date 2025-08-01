import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Colegi from '../features/employees/pages/Colegi/Colegi';

vi.mock('@/features/employees', () => ({
  useAngajati: () => ({ data: [], refetch: vi.fn() }),
  useDeleteAngajat: () => ({ mutateAsync: vi.fn() }),
  useUpdateAngajat: () => ({ mutate: vi.fn() }),
  useCreateEmailAccount: () => ({ mutateAsync: vi.fn() }),
}));

vi.mock('@/features/equipment', () => ({
  useUpdateEchipament: () => ({ mutateAsync: vi.fn() }),
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

vi.mock('@/utils/equipmentIcons', () => ({
  getEquipmentIcon: () => null,
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
    expect(
      screen.getByPlaceholderText('Caută după nume sau funcție')
    ).toBeInTheDocument();
  });
});