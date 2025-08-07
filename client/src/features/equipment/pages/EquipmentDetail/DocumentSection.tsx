import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import UploadButton from '@/components/UploadButton';
import { FileUp, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import http from '@/services/http';
import { toast } from 'react-toastify';
import { handleApiError } from '@/utils/apiError';

const apiBase = (import.meta.env.VITE_API_URL || '/api').replace(/\/api$/, '');

interface DocumentItem {
  id: string;
  name: string;
  path: string;
}

interface Props {
  id: string;
  documents: DocumentItem[];
  refetch: () => void;
}

export default function DocumentSection({ id, documents, refetch }: Props) {
  const [docError, setDocError] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<{ name: string; path: string } | null>(null);
  const [deleteDocId, setDeleteDocId] = useState<string | null>(null);

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      await http.post(`/echipamente/${id}/documents`, formData, {
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
      await http.delete(`/echipamente/${id}/documents/${deleteDocId}`);
      setDeleteDocId(null);
      refetch();
      toast.success('Document șters cu succes');
    } catch (err: unknown) {
      toast.error(handleApiError(err, 'Eroare la ștergere'));
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="font-medium">Documente</h2>
      {documents && documents.length > 0 ? (
        <Card className="p-4">
          <ul className="space-y-2 text-sm">
            {documents.map((doc) => (
              <li key={doc.id} className="flex items-center justify-between">
                <span>{doc.name}</span>
                <div className="flex gap-2">
                  <Button
                    variant="link"
                    className="h-auto p-0 font-normal"
                    onClick={() => setSelectedDoc({ name: doc.name, path: doc.path })}
                  >
                    Vezi
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => setDeleteDocId(doc.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      ) : (
        <Card className="p-4">
          <p className="text-muted-foreground text-sm">Nu există documente disponibile.</p>
        </Card>
      )}
      <div className="space-y-2">
        <UploadButton
          accept="application/pdf"
          onChange={handleDocumentUpload}
          variant="outline"
        >
          <FileUp className="mr-2 h-4 w-4" /> Încarcă document
        </UploadButton>
        {docError && <p className="text-sm text-red-500">{docError}</p>}
      </div>
      {selectedDoc && (
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
      {deleteDocId && (
        <Dialog open onOpenChange={(open) => !open && setDeleteDocId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmare ștergere</DialogTitle>
            </DialogHeader>
            <p className="text-muted-foreground text-sm">Sigur dorești să ștergi acest document?</p>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setDeleteDocId(null)}>
                Anulează
              </Button>
              <Button variant="destructive" onClick={handleDeleteDocument}>
                Confirmă
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}