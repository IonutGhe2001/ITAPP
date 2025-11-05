import { Search } from 'lucide-react';
import { useState, useMemo, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '@/context/useSearch';
import { useSearchSuggestions } from '@/services/searchService';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';
import { levenshtein } from '@/utils/levenshtein';

interface SearchInputProps {
  className?: string;
  onSelect?: () => void;
}

export default function SearchInput({ className, onSelect }: SearchInputProps) {
  const navigate = useNavigate();
  const { query, setQuery } = useSearch();
  const { data: suggestionData } = useSearchSuggestions(query);
  const [activeIndex, setActiveIndex] = useState(-1);

  const suggestions = useMemo(() => {
    if (!suggestionData) return [];
    const q = query.toLowerCase();

    const equipment = suggestionData.echipamente.map((e) => {
      const candidates = [e.nume, e.serie].filter(Boolean) as string[];
      let best = { value: candidates[0], score: Infinity };
      candidates.forEach((c) => {
        const s = levenshtein(c.toLowerCase(), q);
        if (s < best.score) best = { value: c, score: s };
      });
      return best;
    });

    const employees = suggestionData.angajati.map((a) => {
      const candidates = [a.numeComplet, a.functie, a.email, a.cDataUsername, a.cDataId].filter(
        Boolean
      ) as string[];
      let best = { value: candidates[0], score: Infinity };
      candidates.forEach((c) => {
        const s = levenshtein(c.toLowerCase(), q);
        if (s < best.score) best = { value: c, score: s };
      });
      return best;
    });

    return [...equipment, ...employees].sort((a, b) => a.score - b.score).map((r) => r.value);
  }, [suggestionData, query]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(query)}`);
      onSelect?.();
    }
  };

  const handleNavigate = (val: string) => {
    setQuery(val);
    navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(val)}`);
    onSelect?.();
  };

  return (
    <form onSubmit={handleSubmit} className={cn('relative', className)}>
      <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
      <input
        type="text"
        placeholder="Caută..."
        role="combobox"
        aria-autocomplete="list"
        aria-label="Caută"
        aria-expanded={suggestions.length > 0}
        aria-controls="search-suggestions"
        aria-activedescendant={activeIndex >= 0 ? `search-suggestion-${activeIndex}` : undefined}
        className="bg-muted text-foreground border-border focus:ring-primary w-full rounded-md border py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setActiveIndex(-1);
        }}
        onKeyDown={(e) => {
          if (!suggestions.length) return;
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, 0));
          } else if (e.key === 'Enter') {
            if (activeIndex >= 0 && suggestions[activeIndex]) {
              e.preventDefault();
              handleNavigate(suggestions[activeIndex]);
            }
          }
        }}
      />
      {suggestions.length > 0 && (
        <ul
          id="search-suggestions"
          role="listbox"
          className="bg-background border-border absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-md border shadow"
        >
          {suggestions.map((s, idx) => (
            <li
              key={idx}
              className={cn('cursor-pointer px-3 py-1 text-sm', idx === activeIndex && 'bg-muted')}
              id={`search-suggestion-${idx}`}
              role="option"
              aria-selected={idx === activeIndex}
              tabIndex={-1}
              onMouseDown={(e) => {
                e.preventDefault();
                handleNavigate(s);
              }}
              onMouseEnter={() => setActiveIndex(idx)}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
