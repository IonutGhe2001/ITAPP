import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import UploadButton from '@/components/UploadButton';
import { FileUp, Trash2, FileText, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ConfirmDialog from '@/components/ConfirmDialog';
import http from '@/services/http';
import { toast } from 'react-toastify';
import { handleApiError } from '@/utils/apiError';

const apiBase = (import.meta.env.VITE_API_URL || '/api').replace(/\/api$/, '');

interface DocumentItem {
  id: string;
  name: string;
  path: string;
  type?: string;
  size?: number;
  createdAt: string;
  uploadedBy?: string;
}

interface Props {
  angajatId: string;
  documents: DocumentItem[];
  refetch: () => void;
}

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
  });
}

export default function AngajatDocumentSection({ angajatId, documents, refetch }: Props) {
  const [docError, setDocError] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [deleteDocId, setDeleteDocId] = useState<string | null>(null);

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      await http.post(`/angajati/${angajatId}/documents`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setDocError(null);
      refetch();
      toast.success('Document încărcat cu succes');
    } catch (err: unknown) {
      const message = handleApiError(err, 'Eroare la încărcare');
      setDocError(message);
      toast.error(message);
    }
  };

  const handleDeleteDocument = async () => {
    if (!deleteDocId) return;
    try {
      await http.delete(`/angajati/${angajatId}/documents/${deleteDocId}`);
      setDeleteDocId(null);
      refetch();
      toast.success('Document șters cu succes');
    } catch (err: unknown) {
      toast.error(handleApiError(err, 'Eroare la ștergere'));
    }
  };

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

  const isPdf = (doc: DocumentItem) => doc.type === 'application/pdf' || doc.name.endsWith('.pdf');

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        Documente atașate
      </h3>
      <p className="text-sm text-slate-600">
        Încarcă procese verbale semnate și alte documente importante pentru acest angajat.
      </p>
      {documents && documents.length > 0 ? (
        <div className="space-y-2">
          {documents.map((doc) => (
            <Card key={doc.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <FileText className="h-5 w-5 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{doc.name}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                      {doc.size && <span>{formatFileSize(doc.size)}</span>}
                      <span>{formatDate(doc.createdAt)}</span>
                      {doc.uploadedBy && <span>Încărcat de {doc.uploadedBy}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {isPdf(doc) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedDoc(doc)}
                      className="h-8"
                    >
                      Vezi
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(doc.id, doc.name)}
                    className="h-8"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteDocId(doc.id)}
                    className="h-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-6 text-center">
          <FileText className="mx-auto h-12 w-12 text-slate-300" />
          <p className="mt-2 text-sm text-slate-500">Nu există documente încărcate</p>
        </Card>
      )}
      <div className="space-y-2">
        <UploadButton
          accept="application/pdf,image/png,image/jpeg"
          onChange={handleDocumentUpload}
          variant="outline"
          className="w-full"
        >
          <FileUp className="mr-2 h-4 w-4" /> Încarcă document
        </UploadButton>
        <p className="text-xs text-slate-500">
          Acceptă fișiere PDF și imagini (PNG, JPEG) până la 10MB
        </p>
        {docError && <p className="text-sm text-red-500">{docError}</p>}
      </div>
      {selectedDoc && isPdf(selectedDoc) && (
        <Dialog open onOpenChange={(open) => !open && setSelectedDoc(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedDoc.name}</DialogTitle>
            </DialogHeader>
            <iframe src={`${apiBase}${selectedDoc.path}`} className="h-[80vh] w-full" />
            <div className="mt-4 flex justify-end">
              <a
                href={`${apiBase}${selectedDoc.path}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-sm underline"
              >
                Descarcă / deschide în tab nou
              </a>
            </div>
          </DialogContent>
        </Dialog>
      )}
      <ConfirmDialog
        open={!!deleteDocId}
        message="Sigur dorești să ștergi acest document?"
        onCancel={() => setDeleteDocId(null)}
        onConfirm={handleDeleteDocument}
      />
    </div>
  );
}
