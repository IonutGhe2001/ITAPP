import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download, Search, Archive as ArchiveIcon } from 'lucide-react';
import { useSearchArchiveDocuments } from '@/features/employees/angajatiService';
import http from '@/services/http';
import { toast } from 'react-toastify';
import { handleApiError } from '@/utils/apiError';

const DOCUMENT_TYPES = {
  '': 'Toate tipurile',
  PROCES_VERBAL: 'Proces Verbal',
  CONTRACT_ANGAJARE: 'Contract de Angajare',
  CONTRACT_MUNCA: 'Contract de Muncă',
  CERTIFICAT: 'Certificat',
  DIPLOMA: 'Diplomă',
  EVALUARE: 'Evaluare',
  AVERTISMENT: 'Avertisment',
  DECIZIE: 'Decizie',
  CERERE: 'Cerere',
  ALTA_CORESPONDENTA: 'Altă Corespondență',
  OTHER: 'Altele',
} as const;

function formatFileSize(bytes?: number): string {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ro-RO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function Archive() {
  const [employeeName, setEmployeeName] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [uploadYear, setUploadYear] = useState('');
  const [includeInactive, setIncludeInactive] = useState(true);
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useSearchArchiveDocuments({
    employeeName: employeeName || undefined,
    documentType: documentType || undefined,
    uploadYear: uploadYear ? parseInt(uploadYear, 10) : undefined,
    includeInactive,
    page,
    pageSize: 50,
  });

  const handleDownload = async (docId: string, docName: string) => {
    try {
      const response = await http.get(`/angajati/documents/${docId}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', docName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: unknown) {
      toast.error(handleApiError(err, 'Eroare la descărcare'));
    }
  };

  const handleSearch = () => {
    setPage(1);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 15 }, (_, i) => currentYear - i);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-3">
        <ArchiveIcon className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">Arhivă Documente Angajați</h1>
          <p className="text-slate-600">Căutare și accesare documente arhivate</p>
        </div>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Filtrare documente</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employeeName">Nume angajat</Label>
              <Input
                id="employeeName"
                placeholder="Caută după nume..."
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="documentType">Tip document</Label>
              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger id="documentType">
                  <SelectValue placeholder="Toate tipurile" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(DOCUMENT_TYPES).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="uploadYear">Anul documentului</Label>
              <Select value={uploadYear} onValueChange={setUploadYear}>
                <SelectTrigger id="uploadYear">
                  <SelectValue placeholder="Toți anii" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toți anii</SelectItem>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="includeInactive">Status angajat</Label>
              <Select
                value={includeInactive ? 'all' : 'active'}
                onValueChange={(val) => setIncludeInactive(val === 'all')}
              >
                <SelectTrigger id="includeInactive">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toți angajații</SelectItem>
                  <SelectItem value="active">Doar activi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleSearch} className="w-full md:w-auto">
            <Search className="mr-2 h-4 w-4" />
            Caută
          </Button>
        </div>
      </Card>

      {isLoading && (
        <Card className="p-6 text-center">
          <p className="text-slate-600">Se încarcă...</p>
        </Card>
      )}

      {error && (
        <Card className="p-6 text-center">
          <p className="text-red-600">Eroare la încărcarea documentelor</p>
        </Card>
      )}

      {data && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600">
              {data.total} {data.total === 1 ? 'document găsit' : 'documente găsite'}
            </p>
            {data.totalPages > 1 && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Anterior
                </Button>
                <span className="flex items-center px-3 text-sm">
                  Pagina {page} din {data.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === data.totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Următor
                </Button>
              </div>
            )}
          </div>

          {data.data.length === 0 ? (
            <Card className="p-12 text-center">
              <FileText className="mx-auto h-16 w-16 text-slate-300" />
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                Nu s-au găsit documente
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Încearcă să modifici criteriile de căutare
              </p>
            </Card>
          ) : (
            <div className="space-y-2">
              {data.data.map((doc) => (
                <Card key={doc.id} className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <FileText className="h-5 w-5 text-slate-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-slate-900 truncate">
                            {doc.name}
                          </p>
                          {!doc.angajat.isActive && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                              Arhivat
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-700">
                          Angajat: <span className="font-medium">{doc.angajat.numeComplet}</span>{' '}
                          ({doc.angajat.functie})
                        </p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                          <span className="font-medium text-blue-600">
                            {DOCUMENT_TYPES[doc.documentType as keyof typeof DOCUMENT_TYPES] ||
                              doc.documentType}
                          </span>
                          <span>Anul {doc.uploadYear}</span>
                          {doc.size && <span>{formatFileSize(doc.size)}</span>}
                          <span>{formatDate(doc.createdAt)}</span>
                          {doc.uploadedBy && <span>Încărcat de {doc.uploadedBy}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(doc.id, doc.name)}
                        className="h-8"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
