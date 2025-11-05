import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import SearchInput from '@/components/SearchInput';
import { SearchProvider } from '@/context/SearchProvider';

vi.mock('react-router-dom', () => ({
  ...require('react-router-dom'),
  useNavigate: () => vi.fn(),
}));

vi.mock('@/services/searchService', () => ({
  useSearchSuggestions: (query: string) => ({
    data: query ? { echipamente: [{ nume: 'Laptop' }], angajati: [] } : undefined,
  }),
}));

describe('SearchInput accessibility', () => {
  const renderComponent = () =>
    render(
      <SearchProvider>
        <SearchInput />
      </SearchProvider>
    );

  it('renders combobox with aria attributes', () => {
    renderComponent();
    const input = screen.getByRole('combobox', { name: /caută/i });
    expect(input).toHaveAttribute('aria-controls', 'search-suggestions');
  });

  it('displays suggestions with proper roles', () => {
    renderComponent();
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'Lap' } });
    const list = screen.getByRole('listbox');
    expect(list).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Laptop' })).toBeInTheDocument();
  });
});