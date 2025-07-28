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

  return (
    <Container className="py-6 space-y-6">
      <h2 className="text-xl font-semibold">Rezultate pentru "{q}"</h2>
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Echipamente</h3>
          {data?.echipamente?.length ? (
            <ul className="space-y-2">
              {data.echipamente.map((e: any) => (
                <li key={e.id} className="p-2 border rounded-md bg-white shadow">
                  <div className="font-medium">{e.nume}</div>
                  <div className="text-sm text-gray-600">Serie: {e.serie}</div>
                  {e.angajat && (
                    <div className="text-xs text-gray-500">
                      Alocat: {e.angajat.numeComplet}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">Nu s-au găsit echipamente.</p>
          )}
        </div>
        <div>
          <h3 className="font-semibold mb-2">Colegi</h3>
          {data?.angajati?.length ? (
            <ul className="space-y-2">
              {data.angajati.map((c: any) => (
                <li key={c.id} className="p-2 border rounded-md bg-white shadow">
                  <div className="font-medium">{c.numeComplet}</div>
                  <div className="text-sm text-gray-600">{c.functie}</div>
                  <div className="text-xs text-gray-500">{c.email}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">Nu s-au găsit colegi.</p>
          )}
        </div>
      </div>
    </Container>
  );
}