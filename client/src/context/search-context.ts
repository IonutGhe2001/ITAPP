import { createContext } from "react"

interface SearchContextType {
  query: string
  setQuery: (q: string) => void
}

export const SearchContext = createContext<SearchContextType | undefined>(undefined)
export type { SearchContextType }