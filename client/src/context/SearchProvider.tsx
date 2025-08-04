import { useState, type ReactNode } from 'react';
import { SearchContext } from './SearchProvider';

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState('');
  return <SearchContext.Provider value={{ query, setQuery }}>{children}</SearchContext.Provider>;
}
