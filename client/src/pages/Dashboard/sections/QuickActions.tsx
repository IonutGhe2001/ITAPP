'use client';

import { useEffect, useState, Suspense, lazy } from 'react';
import { UserPlusIcon, LaptopIcon, FileTextIcon, UserCogIcon, DownloadIcon } from 'lucide-react';
const ModalAddColeg = lazy(() => import('../modals/ModalAddColeg'));
const ModalAddEchipament = lazy(() => import('../modals/ModalAddEchipament'));
const ModalProcesVerbal = lazy(() => import('../modals/ModalProcesVerbal'));
const ModalCreateUser = lazy(() => import('../modals/ModalCreateUser'));
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getQueueCount, getQueue, clearQueue } from '@/features/proceseVerbale/pvQueue';
import { genereazaProcesVerbal } from '@/features/proceseVerbale';
import { useToast } from '@/hooks/use-toast/use-toast-hook';

export default function QuickActions() {
  const [showColegModal, setShowColegModal] = useState(false);
  const [showEchipamentModal, setShowEchipamentModal] = useState(false);
  const [showProcesModal, setShowProcesModal] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [count, setCount] = useState(getQueueCount());
  const { toast } = useToast();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        setShowEchipamentModal(true);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    const update = () => setCount(getQueueCount());
    window.addEventListener('focus', update);
    window.addEventListener('storage', update);
    return () => {
      window.removeEventListener('focus', update);
      window.removeEventListener('storage', update);
    };
  }, []);

  const handleExportJSON = () => {
    const fakeData = { message: 'Backup local JSON' };
    const blob = new Blob([JSON.stringify(fakeData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleProces = async () => {
    if (count > 0) {
      const queue = getQueue();
      for (const item of queue) {
        try {
          const url = await genereazaProcesVerbal(item.angajatId, item.tip, {
            predate: item.predate,
            primite: item.primite,
          });
          window.open(url, '_blank');
        } catch {
          toast({
            title: 'Eroare la generarea procesului verbal',
            variant: 'destructive',
          });
        }
      }
      clearQueue();
      setCount(0);
    } else {
      setShowProcesModal(true);
    }
  };

  return (
    <>
      <div className="mx-auto grid w-full max-w-5xl grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4">
        <Button
          onClick={() => setShowColegModal(true)}
          variant="outline"
          className="bg-chart-3/10 text-foreground flex h-[100px] w-full min-w-[150px] flex-col items-center justify-center gap-2 whitespace-normal break-words rounded-2xl border px-4 py-2 text-center text-sm font-medium transition-all hover:scale-105"
        >
          <UserPlusIcon className="h-5 w-5" />
          <span className="whitespace-normal break-words leading-tight">Adaugă coleg</span>
        </Button>

        <Button
          onClick={() => setShowEchipamentModal(true)}
          variant="outline"
          className="bg-chart-3/10 text-foreground flex h-[100px] w-full min-w-[150px] flex-col items-center justify-center gap-2 whitespace-normal break-words rounded-2xl border px-4 py-2 text-center text-sm font-medium transition-all hover:scale-105"
        >
          <LaptopIcon className="h-5 w-5" />
          <span className="whitespace-normal break-words leading-tight">Adaugă echipament</span>
        </Button>

        <Button
          onClick={handleProces}
          variant="outline"
          className="bg-chart-3/10 text-foreground relative flex h-[100px] w-full min-w-[150px] flex-col items-center justify-center gap-2 whitespace-normal break-words rounded-2xl border px-4 py-2 text-center text-sm font-medium transition-all hover:scale-105"
        >
          <FileTextIcon className="h-5 w-5" />
          <span className="whitespace-normal break-words leading-tight">
            Generează proces verbal
          </span>
          {count > 0 && (
            <Badge variant="destructive" className="absolute -right-2 -top-2">
              {count}
            </Badge>
          )}
        </Button>

        <Button
          onClick={() => setShowCreateUserModal(true)}
          variant="outline"
          className="bg-chart-3/10 text-foreground flex h-[100px] w-full min-w-[150px] flex-col items-center justify-center gap-2 whitespace-normal break-words rounded-2xl border px-4 py-2 text-center text-sm font-medium transition-all hover:scale-105"
        >
          <UserCogIcon className="h-5 w-5" />
          <span className="whitespace-normal break-words leading-tight">Creează cont</span>
        </Button>

        <Button
          onClick={handleExportJSON}
          variant="outline"
          className="bg-chart-3/10 text-foreground flex h-[100px] w-full min-w-[150px] flex-col items-center justify-center gap-2 whitespace-normal break-words rounded-2xl border px-4 py-2 text-center text-sm font-medium transition-all hover:scale-105"
        >
          <DownloadIcon className="h-5 w-5" />
          <span className="whitespace-normal break-words leading-tight">Exportă JSON</span>
        </Button>
      </div>

      {/* Modaluri */}
      <Suspense fallback={null}>
        {showColegModal && <ModalAddColeg onClose={() => setShowColegModal(false)} />}
        {showEchipamentModal && (
          <ModalAddEchipament onClose={() => setShowEchipamentModal(false)} />
        )}
        {showProcesModal && <ModalProcesVerbal onClose={() => setShowProcesModal(false)} />}
        {showCreateUserModal && <ModalCreateUser onClose={() => setShowCreateUserModal(false)} />}
      </Suspense>
    </>
  );
}
