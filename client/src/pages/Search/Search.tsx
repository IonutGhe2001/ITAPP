import { Fragment } from 'react';
import { Link, generatePath, useSearchParams } from 'react-router-dom';
import Container from '@/components/Container';
import { ROUTES } from '@/constants/routes';
import { useGlobalSearch } from '@/services/searchService';

function escapeRegExp(value: string) {
  return value.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function highlightText(text: string | null | undefined, query: string) {
  if (!text) return null;
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return text;

  try {
    const regex = new RegExp(`(${escapeRegExp(trimmedQuery)})`, 'gi');
    const parts = text.split(regex);
    if (parts.length === 1) return text;
    const normalized = trimmedQuery.toLowerCase();
    return parts.map((part, index) =>
      part.toLowerCase() === normalized ? (
        <mark key={`${part}-${index}`} className="bg-primary/20 text-foreground rounded px-0.5">
          {part}
        </mark>
      ) : (
        <Fragment key={`${part}-${index}`}>{part}</Fragment>
      )
    );
  } catch {
    return text;
  }
}

export default function SearchResults() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const { data, isLoading, isFetching } = useGlobalSearch(q);
  const trimmedQuery = q.trim();
  
  const isPending = isLoading || isFetching;
  const noResults = !data?.echipamente?.length && !data?.angajati?.length;
  const showNoResults = !isPending && noResults;

  const renderSkeletonItems = (count: number) => (
    <ul className="space-y-2" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <li
          key={index}
          className="bg-card border-border animate-pulse rounded-md border p-3 shadow"
        >
          <div className="bg-muted mb-2 h-4 w-1/3 rounded" />
          <div className="bg-muted mb-1 h-3 w-1/2 rounded" />
          <div className="bg-muted h-3 w-1/4 rounded" />
        </li>
      ))}
    </ul>
  );

  return (
    <Container className="space-y-6 py-6">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold">Rezultate pentru "{q}"</h2>
        {isPending && (
          <div
            role="status"
            aria-live="polite"
            className="text-muted-foreground flex items-center gap-2 text-sm"
          >
            <span className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
            <span>Se încarcă...</span>
          </div>
        )}
      </div>
      {showNoResults && data?.suggestions && (
        <div className="text-muted-foreground mb-4 text-sm">
          <p className="mb-2">Nu am găsit rezultate. Poate ai vrut să cauți:</p>
          <ul className="ml-5 list-disc space-y-1">
            {data.suggestions.echipamente.map((e) => (
              <li key={e.id}>{e.nume}</li>
            ))}
            {data.suggestions.angajati.map((a) => (
              <li key={a.id}>{a.numeComplet}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="space-y-4">
        <div>
          <h3 className="mb-2 font-semibold">Echipamente</h3>
          {isPending ? (
            renderSkeletonItems(3)
          ) : data?.echipamente?.length ? (
            <ul className="space-y-2">
              {data.echipamente.map((e) => {
                const detailPath = generatePath(ROUTES.EQUIPMENT_DETAIL, { id: e.id });
                return (
                  <li key={e.id}>
                    <Link
                      to={detailPath}
                      className="bg-card border-border hover:border-primary focus-visible:ring-primary block rounded-md border p-3 shadow transition focus-visible:outline-none focus-visible:ring-2"
                    >
                      <div className="font-medium">{highlightText(e.nume, q)}</div>
                      <div className="text-muted-foreground text-sm">
                        Serie: {highlightText(e.serie ?? '', q)}
                      </div>
                      {e.angajat && (
                        <div className="text-muted-foreground text-xs">
                          Alocat: {highlightText(e.angajat.numeComplet, q)}
                        </div>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm">Nu s-au găsit echipamente.</p>
          )}
        </div>
        <div>
          <h3 className="mb-2 font-semibold">Colegi</h3>
          {isPending ? (
            renderSkeletonItems(3)
          ) : data?.angajati?.length ? (
            <ul className="space-y-2">
              {data.angajati.map((c) => {
                const colleagueParams = new URLSearchParams({ highlight: c.id });
                if (trimmedQuery) {
                  colleagueParams.set('q', trimmedQuery);
                }
                const colleagueLink = `${ROUTES.COLEGI}?${colleagueParams.toString()}`;
                return (
                  <li key={c.id}>
                    <Link
                      to={colleagueLink}
                      className="bg-card border-border hover:border-primary focus-visible:ring-primary block rounded-md border p-3 shadow transition focus-visible:outline-none focus-visible:ring-2"
                    >
                      <div className="font-medium">{highlightText(c.numeComplet, q)}</div>
                      <div className="text-muted-foreground text-sm">
                        {highlightText(c.functie ?? '', q)}
                      </div>
                      {c.email && (
                        <div className="text-muted-foreground text-xs">
                          {highlightText(c.email, q)}
                        </div>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm">Nu s-au găsit colegi.</p>
          )}
        </div>
      </div>
    </Container>
  );
}
