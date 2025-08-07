import { useState } from 'react';
import { Button } from '@/components/ui/button';
import UploadButton from '@/components/UploadButton';
import { Trash2, ImageUp } from 'lucide-react';
import ConfirmDialog from '@/components/ConfirmDialog';
import http from '@/services/http';
import { toast } from 'react-toastify';
import { handleApiError } from '@/utils/apiError';

const apiBase = (import.meta.env.VITE_API_URL || '/api').replace(/\/api$/, '');

interface ImageItem {
  id: string;
  url: string;
}

interface Props {
  id: string;
  images: ImageItem[];
  refetch: () => void;
}

export default function ImageGallery({ id, images, refetch }: Props) {
  const [imageError, setImageError] = useState<string | null>(null);
  const [deleteImageId, setDeleteImageId] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      await http.post(`/echipamente/${id}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImageError(null);
      refetch();
      toast.success('Imagine încărcată cu succes');
    } catch (err: unknown) {
      const message = handleApiError(err, 'Eroare la încărcare');
      setImageError(message);
      toast.error(message);
    }
  };

  const handleDeleteImage = async () => {
    if (!deleteImageId) return;
    try {
      await http.delete(`/echipamente/${id}/images/${deleteImageId}`);
      setDeleteImageId(null);
      refetch();
      toast.success('Imagine ștearsă cu succes');
    } catch (err: unknown) {
      toast.error(handleApiError(err, 'Eroare la ștergere'));
    }
  };

  return (
    <>
      {images && images.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
          {images.map((img) => (
            <div key={img.id} className="relative">
              <img
                src={`${apiBase}${img.url}`}
                alt="equipment"
                className="aspect-video rounded object-cover"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute right-1 top-1 h-6 w-6"
                onClick={() => setDeleteImageId(img.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">Nu există imagini disponibile.</p>
      )}
      <div className="space-y-2">
        <UploadButton accept="image/png,image/jpeg" onChange={handleImageUpload} variant="outline">
          <ImageUp className="mr-2 h-4 w-4" /> Încarcă imagine
        </UploadButton>
        {imageError && <p className="text-sm text-red-500">{imageError}</p>}
      </div>
      <ConfirmDialog
        open={!!deleteImageId}
        message="Sigur dorești să ștergi această imagine?"
        onCancel={() => setDeleteImageId(null)}
        onConfirm={handleDeleteImage}
      />
    </>
  );
}