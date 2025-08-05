import { render, screen } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import EquipmentList from '@/features/equipment/components/EquipmentList';
import type { Echipament } from '@/features/equipment/types';
import { BrowserRouter } from 'react-router-dom';

// Mock nested equipment exports used by EquipmentCard
vi.mock('@/features/equipment', () => ({
  EquipmentIcon: () => <span data-testid="icon" />,
  EQUIPMENT_STATUS_LABELS: { in_stoc: 'În stoc', alocat: 'Alocat' },
}));

// Simplify react-window behavior
vi.mock('react-window', () => ({
  FixedSizeList: ({ itemCount, children }: any) => (
    <div>
      {Array.from({ length: itemCount }).map((_, index) => (
        <div key={index}>{children({ index, style: {} })}</div>
      ))}
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
    const echipamente: Echipament[] = [
      {
        id: '1',
        nume: 'Laptop',
        tip: 'laptop',
        serie: '123',
        stare: 'in_stoc',
        angajat: { id: 'a1', numeComplet: 'Ion Popescu' },
      },
    ];
    render(
      <BrowserRouter>
        <EquipmentList echipamente={echipamente} onEdit={vi.fn()} onDelete={vi.fn()} />
      </BrowserRouter>
    );
    expect(screen.getByText('Laptop')).toBeInTheDocument();
    expect(screen.getByText('Serie: 123')).toBeInTheDocument();
    expect(screen.getByText('Predat la: Ion Popescu')).toBeInTheDocument();
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/echipamente/1');
  });

  it('shows empty message when no data', () => {
    render(
      <BrowserRouter>
        <EquipmentList echipamente={[]} onEdit={vi.fn()} onDelete={vi.fn()} />
      </BrowserRouter>
    );
    expect(screen.getByText('Nu există echipamente înregistrate.')).toBeInTheDocument();
  });
});