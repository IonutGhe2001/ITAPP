import React, { useState } from 'react';
import { Pencil, X } from 'lucide-react';
import { updateCurrentUser } from '@/services/authService';
import { useTranslation } from 'react-i18next';
import { useUser } from '@/context/useUser';
import type { User } from '@/types/user';
import { useToast } from '@/hooks/use-toast/use-toast-hook';
import Container from '@/components/Container';
import Avatar from '@/components/Avatar';
import ProfileInput from '@/components/ProfileInput';
import SignatureEditor from '@/components/SignatureEditor';

export default function ProfilePage() {
  const { user, setUser } = useUser();
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [original, setOriginal] = useState<User | null>(user ?? null);
  const { toast } = useToast();
  const { t } = useTranslation();

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

  return (
    <Container className="py-10">
      <h1 className="text-foreground mb-8 text-3xl font-bold">{t('profile.heading')}</h1>

      <div className="bg-card flex flex-col items-center gap-6 rounded-2xl p-6 shadow-md">
        <div className="relative">
          <Avatar
            src={user?.profilePicture ?? undefined}
            name={`${user?.nume ?? ''} ${user?.prenume ?? ''}`}
            className="border-primary h-32 w-32 border-4 shadow"
          />
          {isEditing && (
            <>
              <label
                htmlFor="profile-picture"
                className="bg-primary text-primary-foreground absolute bottom-0 right-0 cursor-pointer rounded-full p-2 shadow"
              >
                <Pencil size={16} />
                <input
                  id="profile-picture"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              {user?.profilePicture && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="bg-destructive text-destructive-foreground absolute right-0 top-0 rounded-full p-1 shadow"
                >
                  <X size={14} />
                </button>
              )}
            </>
          )}
        </div>

        <SignatureEditor
          signature={user?.digitalSignature ?? null}
          isEditing={isEditing}
          onChange={(sig) => {
            if (user) {
              setUser({ ...user, digitalSignature: sig });
            }
          }}
        />

        <div className="w-full space-y-4">
          {isEditing ? (
            <>
              <ProfileInput label={t('profile.labels.lastName')} value={user?.nume} onChange={handleChange('nume')} />
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
            </>
          ) : (
            <>
              <ProfileField
                label={t('profile.labels.fullName')}
                value={`${user?.nume ?? ''} ${user?.prenume ?? ''}`}
              />
              <ProfileField label={t('profile.labels.email')} value={user?.email} />
              <ProfileField label={t('profile.labels.position')} value={user?.functie} />
              <ProfileField label={t('profile.labels.phone')} value={user?.telefon || '-'} />
            </>
          )}
        </div>

        <div className="mt-6 flex gap-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-primary text-primary-foreground hover:bg-primary/80 rounded-xl px-6 py-2 transition"
              >
                {isSaving ? t('profile.buttons.saving') : t('profile.buttons.save')}
              </button>
              <button
                onClick={handleCancel}
                className="bg-muted text-foreground hover:bg-muted/70 rounded-xl px-6 py-2 transition"
              >
                {t('profile.buttons.cancel')}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/80 rounded-xl px-6 py-2 transition"
            >
              {t('profile.buttons.edit')}
            </button>
          )}
        </div>
      </div>
    </Container>
  );
}

function ProfileField({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-muted-foreground text-sm">{label}</p>
      <p className="text-foreground text-base font-medium">{value}</p>
    </div>
  );
}
