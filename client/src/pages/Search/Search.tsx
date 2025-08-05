import { useSearchParams } from 'react-router-dom';
import Container from '@/components/Container';
import { useGlobalSearch } from '@/services/searchService';

export default function SearchResults() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const { data } = useGlobalSearch(q);

  const noResults = !data?.echipamente?.length && !data?.angajati?.length;

  return (
    <Container className="space-y-6 py-6">
      <h2 className="text-xl font-semibold">Rezultate pentru "{q}"</h2>
      {noResults && data?.suggestions && (
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
          {data?.echipamente?.length ? (
            <ul className="space-y-2">
              {data.echipamente.map((e) => (
                <li key={e.id} className="bg-card rounded-md border p-2 shadow">
                  <div className="font-medium">{e.nume}</div>
                  <div className="text-muted-foreground text-sm">Serie: {e.serie}</div>
                  {e.angajat && (
                    <div className="text-muted-foreground text-xs">
                      Alocat: {e.angajat.numeComplet}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm">Nu s-au găsit echipamente.</p>
          )}
        </div>
        <div>
          <h3 className="mb-2 font-semibold">Colegi</h3>
          {data?.angajati?.length ? (
            <ul className="space-y-2">
              {data.angajati.map((c) => (
                <li key={c.id} className="bg-card rounded-md border p-2 shadow">
                  <div className="font-medium">{c.numeComplet}</div>
                  <div className="text-muted-foreground text-sm">{c.functie}</div>
                  <div className="text-muted-foreground text-xs">{c.email}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm">Nu s-au găsit colegi.</p>
          )}
        </div>
      </div>
    </Container>
  );
}
