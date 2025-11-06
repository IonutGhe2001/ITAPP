import React, { Suspense, useId, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { updateCurrentUser } from '@/services/authService';
import { getUserSessions } from '@/services/profileService';
import { useTranslation } from 'react-i18next';
import { useUser } from '@/context/useUser';
import type { User } from '@/types/user';
import { useToast } from '@/hooks/use-toast/use-toast-hook';
import Avatar from '@/components/Avatar';
import ProfileInput from '@/components/ProfileInput';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const SignatureEditor = React.lazy(() => import('@/components/SignatureEditor'));

export default function ProfilePage() {
  const { user, setUser } = useUser();
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [original, setOriginal] = useState<User | null>(user ?? null);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputId = useId();
  const fullName = [user?.nume, user?.prenume].filter(Boolean).join(' ').trim();

  // Extract city and county from location
  const extractLocation = (locatie: string | null | undefined): string => {
    if (!locatie) return '-';
    // Assuming location format is "City, County" or similar
    const parts = locatie.split(',').map(part => part.trim());
    return parts.join(', ');
  };

  const formatLastLogin = (lastLogin: string | null | undefined): string => {
    if (!lastLogin) return '-';
    const date = new Date(lastLogin);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    const ONE_MINUTE = 1;
    const ONE_HOUR = 60;
    const TWO_HOURS = 120;
    const ONE_DAY = 1440;
    
    if (diffMins < ONE_MINUTE) return 'Acum';
    if (diffMins < ONE_HOUR) return `Acum ${diffMins} minute`;
    if (diffMins < TWO_HOURS) return 'Acum 1 oră';
    if (diffMins < ONE_DAY) return `Acum ${Math.floor(diffMins / ONE_HOUR)} ore`;
    
    return date.toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const formatSessionLastActive = (value: string | null | undefined): string => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const sessionsQuery = useQuery({
    queryKey: ['profile', 'sessions'],
    queryFn: getUserSessions,
    staleTime: 30_000,
  });

  const activeSessions = sessionsQuery.data ?? [];
  const isLoadingSessions = sessionsQuery.isLoading;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (user) {
          setUser({ ...user, profilePicture: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    if (user) {
      setUser({ ...user, profilePicture: null });
    }
  };

  const handleChange = (field: keyof User) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (user) {
      setUser({ ...user, [field]: e.target.value });
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const updated = await updateCurrentUser(user);
      setUser(updated);
      setOriginal(updated);
      setIsEditing(false);
      toast({
        title: t('profile.saveSuccessTitle'),
        description: t('profile.saveSuccessDesc'),
      });
    } catch (_err) {
      console.error(t('profile.saveError'), _err);
      alert(t('profile.saveErrorMessage'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setUser(original);
    setIsEditing(false);
  };

  const triggerFileDialog = () => {
    fileInputRef.current?.click();
  };

  const metaItems = [
    {
      label: t('profile.meta.department', { defaultValue: 'Departament' }),
      value: user?.departament || user?.functie || '-',
    },
    {
      label: t('profile.meta.location', { defaultValue: 'Locație' }),
      value: extractLocation(user?.locatie),
    },
    {
      label: t('profile.meta.lastLogin', { defaultValue: 'Ultima autentificare' }),
      value: formatLastLogin(user?.lastLogin),
    },
  ];

      return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="space-y-6">
        <div className="border-border/60 from-primary/20 via-primary/10 relative overflow-hidden rounded-3xl border bg-gradient-to-r to-transparent shadow-sm">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.4),transparent_55%)]" />
          <div className="relative flex flex-col gap-8 p-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="flex flex-col items-center gap-4">
                <Avatar
                  src={user?.profilePicture ?? undefined}
                  name={fullName}
                  className="ring-primary/20 h-28 w-28 rounded-full border-2 border-white/60 shadow-lg ring-4"
                />
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <input
                    ref={fileInputRef}
                    id={fileInputId}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={triggerFileDialog}
                    className="focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2"
                  >
                    {t('profile.buttons.uploadPhoto', { defaultValue: 'Upload photo' })}
                  </Button>
                  {user?.profilePicture ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={handleRemoveImage}
                      className="focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2"
                    >
                      {t('profile.buttons.removePhoto', { defaultValue: 'Remove' })}
                    </Button>
                  ) : null}
                </div>
              </div>
            <div className="space-y-4 text-center sm:text-left">
                <div>
                  <h1 className="text-foreground text-3xl font-semibold tracking-tight">
                    {fullName || t('profile.heading')}
                  </h1>
                  <p className="text-muted-foreground text-base">
                    {user?.functie || t('profile.labels.position', { defaultValue: 'Role' })}
                  </p>
                </div>
                <dl className="grid gap-3 text-left text-sm sm:grid-cols-3">
                  {metaItems.map((item) => (
                    <div
                      key={item.label}
                      className="bg-background/60 rounded-xl px-4 py-3 shadow-sm"
                    >
                      <dt className="text-muted-foreground text-xs uppercase tracking-wide">
                        {item.label}
                      </dt>
                      <dd className="text-foreground mt-1 text-sm font-medium">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsPasswordDialogOpen(true)}
                className="focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2"
              >
                {t('profile.buttons.changePassword', { defaultValue: 'Change password' })}
              </Button>
              <Button
                type="button"
                onClick={() => setIsEditing(true)}
                className="focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2"
              >
                {t('profile.buttons.edit', { defaultValue: 'Edit profile' })}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7 xl:col-span-8">
            <section className="border-border/60 bg-card/90 rounded-2xl border p-6 shadow-sm">
              <header className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  {t('profile.sections.contact', { defaultValue: 'Contact & Organization' })}
                </h2>
              </header>
              <dl className="grid gap-4 sm:grid-cols-2">
                <DefinitionItem label={t('profile.labels.fullName')} value={fullName || '-'} />
                <DefinitionItem
                  label={t('profile.labels.position')}
                  value={user?.functie || '-'}
                />
                <DefinitionItem label={t('profile.labels.email')} value={user?.email || '-'} />
                <DefinitionItem
                  label={t('profile.labels.phone')}
                  value={user?.telefon || '-'}
                />
              </dl>
            </section>

              <section className="border-border/60 bg-card/90 rounded-2xl border p-6 shadow-sm">
              <header className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold">
                    {t('profile.labels.digitalSignature', {
                      defaultValue: 'Digital signature',
                    })}
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    {t('profile.signature.description', {
                      defaultValue: 'Preview of your current digital signature.',
                    })}
                  </p>
                </div>
            <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    className="focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2"
                  >
                    {t('profile.buttons.replace', { defaultValue: 'Replace' })}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2"
                  >
                    {t('profile.buttons.download', { defaultValue: 'Download' })}
                  </Button>
                </div>
              </header>
              <div className="border-border/60 bg-muted/20 flex h-48 items-center justify-center rounded-xl border border-dashed">
                {user?.digitalSignature ? (
                  <img
                    src={user.digitalSignature}
                    alt={t('profile.labels.digitalSignature', {
                      defaultValue: 'Digital signature',
                    })}
                    className="max-h-32 object-contain"
                  />
                ) : (
                  <p className="text-muted-foreground text-sm">
                    {t('profile.signature.empty', { defaultValue: 'No signature on file.' })}
                  </p>
                )}
              </div>
            </section>
          </div>

                <div className="space-y-6 lg:col-span-5 xl:col-span-4">
            <section className="border-border/60 bg-card/90 rounded-2xl border p-6 shadow-sm">
              <header className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-semibold">
                  {t('profile.sections.sessions', { defaultValue: 'Sesiuni active' })}
                </h2>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2"
                >
                  {t('profile.buttons.signOutOthers', { defaultValue: 'Deconectează-te de pe celelalte' })}
                </Button>
              </header>
              <div className="border-border/50 overflow-hidden rounded-xl border">
                {isLoadingSessions ? (
                  <div className="space-y-2 p-4" aria-hidden>
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="bg-muted/30 h-10 animate-pulse rounded-md" />
                    ))}
                  </div>
                ) : activeSessions.length ? (
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-muted/40 text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3 font-medium">Dispozitiv</th>
                        <th className="px-4 py-3 font-medium">Tip</th>
                        <th className="px-4 py-3 font-medium">Locație</th>
                        <th className="px-4 py-3 font-medium">Ultima activitate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeSessions.map((session) => (
                        <tr
                          key={`${session.deviceName}-${session.lastActive}`}
                          className="border-border/40 border-t"
                        >
                          <td className="px-4 py-3 font-medium">{session.deviceName}</td>
                          <td className="text-muted-foreground px-4 py-3">{session.deviceType}</td>
                          <td className="text-muted-foreground px-4 py-3">{session.locationName}</td>
                          <td className="text-muted-foreground px-4 py-3">
                            {formatSessionLastActive(session.lastActive)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-muted-foreground px-4 py-6 text-sm">
                    {t('profile.sessions.empty', { defaultValue: 'Nu există sesiuni active înregistrate.' })}
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>

      <Dialog
        open={isEditing}
        onOpenChange={(open) => (!open ? handleCancel() : setIsEditing(true))}
      >
        <DialogContent className="sm:left-auto sm:right-0 sm:top-0 sm:h-full sm:max-w-xl sm:translate-x-0 sm:translate-y-0 sm:rounded-l-3xl">
          <DialogHeader className="space-y-1">
            <DialogTitle>{t('profile.drawer.title', { defaultValue: 'Edit profile' })}</DialogTitle>
            <DialogDescription>
              {t('profile.drawer.description', {
                defaultValue: 'Update your personal and organizational details.',
              })}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 overflow-y-auto pr-2">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ProfileInput
                label={t('profile.labels.lastName')}
                value={user?.nume}
                onChange={handleChange('nume')}
              />
              <ProfileInput
                label={t('profile.labels.firstName')}
                value={user?.prenume}
                onChange={handleChange('prenume')}
              />
              <ProfileInput
                label={t('profile.labels.position')}
                value={user?.functie}
                onChange={handleChange('functie')}
              />
              <ProfileInput
                label={t('profile.labels.phone')}
                value={user?.telefon || ''}
                onChange={handleChange('telefon')}
              />
              <ProfileInput
                label={t('profile.meta.department', { defaultValue: 'Departament' })}
                value={user?.departament || ''}
                onChange={handleChange('departament')}
              />
              <ProfileInput
                label={t('profile.meta.location', { defaultValue: 'Locație' })}
                value={user?.locatie || ''}
                onChange={handleChange('locatie')}
              />
            </div>
            <div className="border-border/60 bg-card/90 rounded-2xl border p-4 shadow-sm">
              <h3 className="text-sm font-semibold">
                {t('profile.labels.digitalSignature', { defaultValue: 'Digital signature' })}
              </h3>
              <div className="mt-4">
                <Suspense
                  fallback={
                    <div className="flex h-32 items-center justify-center">
                      <div className="border-primary h-10 w-10 animate-spin rounded-full border-2 border-t-transparent" />
                    </div>
                  }
                >
                  <SignatureEditor
                    signature={user?.digitalSignature ?? null}
                    isEditing={isEditing}
                    onChange={(sig) => {
                      if (user) {
                        setUser({ ...user, digitalSignature: sig });
                      }
                    }}
                  />
                </Suspense>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
              className="focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              {t('profile.buttons.cancel')}
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              {isSaving ? t('profile.buttons.saving') : t('profile.buttons.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {t('profile.dialogs.changePassword.title', { defaultValue: 'Change password' })}
            </DialogTitle>
            <DialogDescription>
              {t('profile.dialogs.changePassword.description', {
                defaultValue: 'Update your account password to keep your profile secure.',
              })}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">
                {t('profile.dialogs.changePassword.current', { defaultValue: 'Current password' })}
              </Label>
              <Input id="current-password" type="password" autoComplete="current-password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">
                {t('profile.dialogs.changePassword.new', { defaultValue: 'New password' })}
              </Label>
              <Input id="new-password" type="password" autoComplete="new-password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">
                {t('profile.dialogs.changePassword.confirm', { defaultValue: 'Confirm password' })}
              </Label>
              <Input id="confirm-password" type="password" autoComplete="new-password" />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsPasswordDialogOpen(false)}
              className="focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              {t('profile.buttons.cancel')}
            </Button>
            <Button
              type="button"
              onClick={() => setIsPasswordDialogOpen(false)}
              className="focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              {t('profile.buttons.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DefinitionItem({ label, value }: { label: string; value?: string }) {
  return (
    <div className="border-border/40 bg-background/80 rounded-xl border p-4">
      <dt className="text-muted-foreground text-xs uppercase tracking-wide">{label}</dt>
      <dd className="text-foreground mt-1 text-sm font-medium">{value || '-'}</dd>
    </div>
  );
}
