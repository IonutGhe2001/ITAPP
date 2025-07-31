import { Search } from "lucide-react";
import { useState, useMemo, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "@/context/use-search";
import { useSearchSuggestions } from "@/services/searchService";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  className?: string;
  onSelect?: () => void;
}

export default function SearchInput({ className, onSelect }: SearchInputProps) {
  const navigate = useNavigate();
  const { query, setQuery } = useSearch();
  const { data: suggestionData } = useSearchSuggestions(query);
  const [activeIndex, setActiveIndex] = useState(-1);

  const suggestions = useMemo(
    () => [
      ...(suggestionData?.echipamente.map((e) => e.nume) || []),
      ...(suggestionData?.angajati.map((a) => a.numeComplet) || []),
    ],
    [suggestionData]
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      onSelect?.();
    }
  };

  const handleNavigate = (val: string) => {
    setQuery(val);
    navigate(`/search?q=${encodeURIComponent(val)}`);
    onSelect?.();
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
      <input
        type="text"
        placeholder="Caută..."
        className="pl-9 pr-4 py-2 text-sm bg-muted text-foreground rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary w-full"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setActiveIndex(-1);
        }}
        onKeyDown={(e) => {
          if (!suggestions.length) return;
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, 0));
          } else if (e.key === "Enter") {
            if (activeIndex >= 0 && suggestions[activeIndex]) {
              e.preventDefault();
              handleNavigate(suggestions[activeIndex]);
            }
          }
        }}
      />
      {suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 mt-1 bg-background border border-border rounded-md shadow z-50 max-h-60 overflow-y-auto">
          {suggestions.map((s, idx) => (
            <li
              key={idx}
              className={cn(
                "px-3 py-1 text-sm cursor-pointer",
                idx === activeIndex && "bg-muted"
              )}
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