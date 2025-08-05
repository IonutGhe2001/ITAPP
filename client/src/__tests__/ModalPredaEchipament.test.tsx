import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ModalPredaEchipament from '@/features/equipment/components/ModalPredaEchipament';

vi.mock('@/features/employees', () => ({
  useAngajati: () => ({ data: [{ id: '1', numeComplet: 'John Doe' }] }),
}));

describe('ModalPredaEchipament accessibility', () => {
  it('focuses select trigger when opened', async () => {
    render(
      <ModalPredaEchipament
        echipament={{ id: '1', nume: 'Test', tip: 'Laptop', serie: '123', stare: 'in_stoc' as any }}
        onClose={() => {}}
        onSubmit={() => {}}
      />
    );

    const trigger = await screen.findByLabelText('Selectează angajatul');
    expect(trigger).toHaveFocus();
  });
});