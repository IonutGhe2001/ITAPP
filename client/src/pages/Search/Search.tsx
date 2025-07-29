import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Container from "@/components/Container";
import { useGlobalSearch } from "@/services/searchService";

export default function SearchResults() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const { data, refetch } = useGlobalSearch(q);

  useEffect(() => {
    if (q) {
      refetch();
    }
  }, [q, refetch]);

   const noResults = !data?.echipamente?.length && !data?.angajati?.length;

  return (
    <Container className="py-6 space-y-6">
      <h2 className="text-xl font-semibold">Rezultate pentru "{q}"</h2>
      {noResults && data?.suggestions && (
         <div className="mb-4 text-sm text-muted-foreground">
          <p className="mb-2">Nu am găsit rezultate. Poate ai vrut să cauți:</p>
          <ul className="list-disc ml-5 space-y-1">
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
          <h3 className="font-semibold mb-2">Echipamente</h3>
          {data?.echipamente?.length ? (
            <ul className="space-y-2">
              {data.echipamente.map((e) => (
                <li key={e.id} className="p-2 border rounded-md bg-card shadow">
                  <div className="font-medium">{e.nume}</div>
                  <div className="text-sm text-muted-foreground">Serie: {e.serie}</div>
                  {e.angajat && (
                   <div className="text-xs text-muted-foreground">
                      Alocat: {e.angajat.numeComplet}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Nu s-au găsit echipamente.</p>
          )}
        </div>
        <div>
          <h3 className="font-semibold mb-2">Colegi</h3>
          {data?.angajati?.length ? (
            <ul className="space-y-2">
               {data.angajati.map((c) => (
                <li key={c.id} className="p-2 border rounded-md bg-card shadow">
                  <div className="font-medium">{c.numeComplet}</div>
                  <div className="text-sm text-muted-foreground">{c.functie}</div>
                  <div className="text-xs text-muted-foreground">{c.email}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Nu s-au găsit colegi.</p>
          )}
        </div>
      </div>
    </Container>
  );
}