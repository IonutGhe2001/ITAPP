import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import EquipmentList from '@/features/equipment/components/EquipmentList';
import type { Echipament } from '@/features/equipment/types';
import { BrowserRouter } from 'react-router-dom';

vi.mock('@/features/equipment', () => ({
  EquipmentIcon: () => <span data-testid="icon" />,
  StatusBadge: ({ status }: { status: string }) => <span>{status}</span>,
}));

describe('EquipmentList', () => {
  it('renders equipment items with assignment link', () => {
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
        <EquipmentList echipamente={echipamente} onEdit={vi.fn()} onDelete={vi.fn()} onTransfer={vi.fn()} />
      </BrowserRouter>
    );

    expect(screen.getByText('Laptop')).toBeInTheDocument();
    expect(screen.getByText('Serie: 123')).toBeInTheDocument();
    expect(screen.getByText('Ion Popescu')).toHaveAttribute('href', '/colegi?highlight=a1');
  });

  it('renders nothing when list is empty', () => {
    const { container } = render(
      <BrowserRouter>
        <EquipmentList echipamente={[]} onEdit={vi.fn()} onDelete={vi.fn()} />
      </BrowserRouter>
    );
    
    expect(container.firstChild).toBeNull();
  });
});