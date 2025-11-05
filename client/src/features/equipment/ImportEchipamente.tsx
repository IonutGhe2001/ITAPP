import { useState, memo } from 'react';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import { UploadCloud, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast/use-toast-hook';
import { cn } from '@/lib/utils';

function ImportEchipamente({ onImportSuccess }: { onImportSuccess?: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    importate: number;
    erori: { index: number; error: string }[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastImportedAt, setLastImportedAt] = useState<Date | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setError(null);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
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
      formData.append('file', file);

      const res = await api.post('/import/echipamente', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(res.data);
      setLastImportedAt(new Date());

      if (res.data.importate > 0) {
        onImportSuccess?.();
        toast({
          title: 'Import reușit',
          description: `${res.data.importate} echipamente au fost importate cu succes.`,
        });
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } };
      const message = axiosErr.response?.data?.error || 'Eroare la import';
      setError(message);
      toast({ title: 'Import eșuat', description: message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Import echipamente
          </h3>
          <p className="text-muted-foreground text-xs">
            Încarcă un fișier .xlsx și monitorizează rezultatele.
          </p>
        </div>
        {lastImportedAt && (
          <span className="text-muted-foreground text-xs">
            Ultimul import: {lastImportedAt.toLocaleString()}
          </span>
        )}
      </div>

      <label
        htmlFor="equipment-import"
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        className={cn(
          'hover:border-primary/40 hover:bg-primary/5 mt-4 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300/70 bg-slate-50/80 p-6 text-center transition dark:border-slate-700/70 dark:bg-slate-900/50',
          file && 'border-primary/60 bg-primary/5'
        )}
      >
        <UploadCloud className="text-primary h-8 w-8" aria-hidden="true" />
        <div className="text-muted-foreground space-y-1 text-sm">
          <p className="font-medium text-slate-700 dark:text-slate-200">
            Trage fișierul aici sau selectează din calculator
          </p>
          <p>Format acceptat: .xlsx</p>
          {file && <p className="text-primary">Fișier selectat: {file.name}</p>}
        </div>
        <input
          id="equipment-import"
          type="file"
          accept=".xlsx"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <a
          href="/template_import_echipamente.xlsx"
          download
          className="text-primary inline-flex items-center gap-2 text-sm hover:underline"
        >
          <Download className="h-4 w-4" aria-hidden="true" /> Descarcă șablon Excel
        </a>
        <Button onClick={handleImport} disabled={!file || loading} className="rounded-xl px-4 py-2">
          {loading ? 'Se importă...' : 'Importă echipamente'}
        </Button>
      </div>

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

        {result && (
        <div className="mt-4 space-y-2 rounded-2xl border border-slate-200/60 bg-white/80 p-4 text-sm shadow-sm dark:border-slate-800/60 dark:bg-slate-900/60">
          <p className="font-medium text-slate-700 dark:text-slate-200">
            ✅ {result.importate} echipamente importate cu succes
          </p>
          {result.erori.length > 0 && (
            <div>
              <p className="text-muted-foreground text-xs">Erori:</p>
              <ul className="mt-1 list-inside list-disc space-y-1 text-xs text-red-500">
                {result.erori.map((err, idx) => (
                  <li key={idx}>
                    Rând {err.index + 2}: {err.error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default memo(ImportEchipamente);
