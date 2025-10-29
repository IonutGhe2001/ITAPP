import React, { Suspense, useId, useRef, useState } from 'react';
import { updateCurrentUser } from '@/services/authService';
import { useTranslation } from 'react-i18next';
import { useUser } from '@/context/useUser';
import type { User } from '@/types/user';
import { useToast } from '@/hooks/use-toast/use-toast-hook';
import Container from '@/components/Container';
import Avatar from '@/components/Avatar';
import ProfileInput from '@/components/ProfileInput';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const SignatureEditor = React.lazy(() => import('@/components/SignatureEditor'));

export default function ProfilePage() {
  const { user, setUser } = useUser();
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [original, setOriginal] = useState<User | null>(user ?? null);
  const { toast } = useToast();
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputId = useId();
  const fullName = [user?.nume, user?.prenume].filter(Boolean).join(' ').trim();

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

  return (
    <Container className="max-w-3xl space-y-6 px-6 py-8">
      <header className="space-y-2 border-b border-border/60 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-foreground text-3xl font-semibold">{t('profile.heading')}</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          {t('profile.breadcrumb', { defaultValue: t('profile.heading') })}
        </p>
      </header>

      <Card className="border border-border/60 shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <div className="grid gap-6 md:grid-cols-[192px,1fr]">
            <div className="space-y-6">
              <div className="flex flex-col items-center gap-4 md:items-start">
                <Avatar
                  src={user?.profilePicture ?? undefined}
                  name={fullName}
                  className="h-28 w-28 rounded-full ring-2 ring-primary/20 shadow-sm"
                />
                <input
                  ref={fileInputRef}
                  id={fileInputId}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              {isEditing && (
                  <div className="flex w-full flex-wrap items-center justify-center gap-2 md:justify-start">
                    <Button
                      type="button"
                      size="sm"
                      onClick={triggerFileDialog}
                      className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                      {t('profile.buttons.uploadPhoto', { defaultValue: 'Upload photo' })}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={triggerFileDialog}
                      className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                      {t('profile.buttons.changePhoto', { defaultValue: 'Change' })}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={handleRemoveImage}
                      disabled={!user?.profilePicture}
                      className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                      {t('profile.buttons.removePhoto', { defaultValue: 'Remove' })}
                    </Button>
                  </div>
                )}
              </div>

        <div className="space-y-3">
                <p className="text-muted-foreground text-sm font-medium">
                  {t('profile.labels.digitalSignature', { defaultValue: 'Digital signature' })}
                </p>
                <div className="flex h-24 items-center justify-center rounded-xl border border-border/50 bg-muted/30">
                  <Suspense
                    fallback={
                      <div className="flex items-center justify-center">
                        <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"></div>
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

            <div className="space-y-6">
              {isEditing ? (
                <>
                  <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
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
                  </div>
                  <div className="border-t border-border/60 pt-4">
                    <ProfileField label={t('profile.labels.email')} value={user?.email} />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                    <ProfileField
                      label={t('profile.labels.fullName')}
                      value={fullName || '-'}
                    />
                    <ProfileField label={t('profile.labels.position')} value={user?.functie || '-'} />
                  </div>
                  <div className="border-t border-border/60 pt-4">
                    <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                      <ProfileField label={t('profile.labels.email')} value={user?.email || '-'} />
                      <ProfileField label={t('profile.labels.phone')} value={user?.telefon || '-'} />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 border-t border-border/60 p-4 sm:flex-row sm:justify-end sm:gap-4">
          {isEditing ? (
            <div className="flex w-full flex-col-reverse gap-3 sm:w-auto sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={handleCancel}
                className="w-full focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:w-auto"
              >
                {t('profile.buttons.cancel')}
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="w-full focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:w-auto"
              >
                {isSaving ? t('profile.buttons.saving') : t('profile.buttons.save')}
              </Button>
            </div>
          ) : (
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className="w-full focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:w-auto"
              >
                {t('profile.buttons.changePassword', { defaultValue: 'Change password' })}
              </Button>
              <Button
                type="button"
                onClick={() => setIsEditing(true)}
                className="w-full focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:w-auto"
              >
                {t('profile.buttons.edit')}
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </Container>
  );
}

function ProfileField({ label, value }: { label: string; value?: string }) {
  return (
    <div className="space-y-1">
      <p className="text-muted-foreground text-sm">{label}</p>
      <p className="text-foreground text-base font-medium">{value}</p>
    </div>
  );
}
