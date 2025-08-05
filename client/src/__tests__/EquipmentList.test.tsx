import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import EquipmentList from '@/features/equipment/components/EquipmentList';

// Mock nested equipment exports used by EquipmentCard
vi.mock('@/features/equipment', () => ({
  EquipmentIcon: () => <span data-testid="icon" />, 
  StatusBadge: () => <span data-testid="status" />, 
  EquipmentActions: () => <div data-testid="actions" />, 
  useEquipmentCardModals: () => ({
    openAllocation: vi.fn(),
    openRecupereaza: vi.fn(),
    allocationModal: null,
    recupereazaModal: null,
  }),
}));

// Simplify react-window behavior
vi.mock('react-window', () => ({
  FixedSizeList: ({ itemCount, children }: any) => (
    <div>
      {Array.from({ length: itemCount }).map((_, index) =>
        children({ index, style: {} })
      )}
    </div>
  ),
}));

describe('EquipmentList', () => {
  beforeAll(() => {
    // Ensure layout effects run with dimensions
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      value: 100,
    });
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      value: 100,
    });
    // immediate animation frame
    globalThis.requestAnimationFrame = (cb: FrameRequestCallback): number => {
      cb(0);
      return 0;
    };
  });

  it('renders equipment items', () => {
    const echipamente = [
      { id: '1', nume: 'Laptop', tip: 'laptop', serie: '123', stare: 'in_stoc' },
    ];
    render(
      <EquipmentList echipamente={echipamente} onEdit={vi.fn()} onDelete={vi.fn()} />
    );
    expect(screen.getByText('Laptop')).toBeInTheDocument();
  });

  it('shows empty message when no data', () => {
    render(<EquipmentList echipamente={[]} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(
      screen.getByText('Nu există echipamente înregistrate.')
    ).toBeInTheDocument();
  });
});