import { useState, memo } from "react";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { UploadCloud, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast/useToast";

function ImportEchipamente({ onImportSuccess }: { onImportSuccess?: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<
    { importate: number; erori: { index: number; error: string }[] } | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setError(null);
    }
  };

  const handleImport = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

       const res = await api.post("/import/echipamente", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResult(res.data);

      if (res.data.importate > 0) {
        onImportSuccess?.();
        toast({
          title: "Import reușit",
          description: `${res.data.importate} echipamente au fost importate cu succes.`,
        });
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } };
      setError(axiosErr.response?.data?.error || "Eroare la import");
    } finally {
      setLoading(false);
    }
  };

  return (
   <Card>
      <CardHeader className="flex flex-row items-center gap-3">
        <UploadCloud className="text-primary w-6 h-6" />
        <CardTitle className="text-lg font-semibold text-primary">
          Import echipamente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 flex-1">
        <a
          href="/template_import_echipamente.xlsx"
          download
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          <Download className="w-4 h-4" />
          Descarcă șablon Excel
        </a>

     <p className="text-sm text-muted-foreground">
          Încarcă un fișier Excel (.xlsx) cu echipamente. Poți specifica și angajatul asignat.
        </p>

     {result && (
          <div className="text-sm mt-2">
            <p className="text-green-600 font-medium">
              ✅ {result.importate} echipamente importate
            </p>
            {result.erori.length > 0 && (
              <ul className="text-red-600 list-disc list-inside mt-1">
                {result.erori.map((err, idx) => (
                  <li key={idx}>Rând {err.index + 2}: {err.error}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row sm:items-center gap-3  flex-wrap">
  <input
    type="file"
    accept=".xlsx"
    onChange={handleFileChange}
    className="flex-1 min-w-[150px] text-sm border rounded-lg px-4 py-2 file:border-0 file:bg-primary file:text-white"
  />
  <Button onClick={handleImport} disabled={!file || loading} className="w-full sm:w-auto">
    {loading ? "Se importă..." : "Importă"}
  </Button>
</CardFooter>
    </Card>
  );
}

export default memo(ImportEchipamente);
