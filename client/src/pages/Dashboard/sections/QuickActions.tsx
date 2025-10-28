'use client';

import { useEffect, useState, Suspense, lazy } from 'react';
import {
  UserPlusIcon,
  LaptopIcon,
  FileTextIcon,
  UserCogIcon,
  DownloadIcon,
  ArrowUpRightIcon,
} from 'lucide-react';
const ModalAddColeg = lazy(() => import('../modals/ModalAddColeg'));
const ModalAddEchipament = lazy(() => import('../modals/ModalAddEchipament'));
const ModalProcesVerbal = lazy(() => import('../modals/ModalProcesVerbal'));
const ModalCreateUser = lazy(() => import('../modals/ModalCreateUser'));
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
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

  const actions = [
    {
      id: 'add-colleague',
      label: 'Adaugă coleg',
      description: 'Înregistrează rapid un nou coleg în platformă.',
      icon: <UserPlusIcon className="h-5 w-5" />,
      onClick: () => setShowColegModal(true),
      accent: 'from-sky-500/15 via-sky-500/0 to-transparent',
    },
    {
      id: 'add-equipment',
      label: 'Adaugă echipament',
      description: 'Gestionează stocul cu un nou dispozitiv sau accesoriu.',
      icon: <LaptopIcon className="h-5 w-5" />,
      onClick: () => setShowEchipamentModal(true),
      accent: 'from-violet-500/15 via-violet-500/0 to-transparent',
      shortcut: 'Ctrl + E',
    },
    {
      id: 'proces-verbal',
      label: 'Generează proces verbal',
      description: count > 0 ? `${count} documente gata de semnare.` : 'Pregătește documentele oficiale.',
      icon: <FileTextIcon className="h-5 w-5" />,
      onClick: handleProces,
      accent: 'from-amber-500/15 via-amber-500/0 to-transparent',
      badge: count > 0 ? count : undefined,
    },
    {
      id: 'create-user',
      label: 'Creează cont',
      description: 'Activează accesul pentru un nou utilizator.',
      icon: <UserCogIcon className="h-5 w-5" />,
      onClick: () => setShowCreateUserModal(true),
      accent: 'from-emerald-500/15 via-emerald-500/0 to-transparent',
    },
    {
      id: 'export-json',
      label: 'Exportă JSON',
      description: 'Generează o copie locală cu datele esențiale.',
      icon: <DownloadIcon className="h-5 w-5" />,
      onClick: handleExportJSON,
      accent: 'from-slate-500/15 via-slate-500/0 to-transparent',
    },
  ];

  return (
    <>
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {actions.map((action) => (
          <Button
            key={action.id}
            type="button"
            variant="ghost"
            onClick={action.onClick}
            className={cn(
              'group relative inline-flex h-full min-h-[140px] w-full flex-col items-start gap-4 overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-muted/60 via-background to-background p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg focus-visible:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary/30',
              action.accent
            )}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-background/80 text-primary shadow-sm ring-1 ring-primary/20">
              {action.icon}
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-foreground text-base font-semibold">{action.label}</span>
              <span className="text-muted-foreground text-sm leading-relaxed">{action.description}</span>
            </div>
            <div className="mt-auto flex w-full items-center justify-between text-xs text-muted-foreground">
              {action.shortcut ? (
                <span className="rounded-full border border-border/60 bg-background/80 px-2 py-1 text-[10px] font-medium uppercase tracking-wider">
                  {action.shortcut}
                </span>
              ) : (
                <span className="h-4" />
              )}
              <ArrowUpRightIcon className="h-4 w-4 text-primary transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
            </div>
            {action.badge !== undefined && action.badge > 0 && (
              <Badge variant="destructive" className="absolute right-4 top-4">
                {action.badge}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      <Suspense fallback={null}>
        {showColegModal && <ModalAddColeg onClose={() => setShowColegModal(false)} />}
        {showEchipamentModal && <ModalAddEchipament onClose={() => setShowEchipamentModal(false)} />}
        {showProcesModal && <ModalProcesVerbal onClose={() => setShowProcesModal(false)} />}
        {showCreateUserModal && <ModalCreateUser onClose={() => setShowCreateUserModal(false)} />}
      </Suspense>
    </>
  );
}
