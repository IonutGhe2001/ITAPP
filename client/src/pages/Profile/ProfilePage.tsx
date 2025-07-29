import React, { useState } from "react";
import { Pencil } from "lucide-react";
import { updateCurrentUser } from "@/services/authService";
import { useUser } from "@/store/use-user";
import type { User } from "@/types/user";
import { useToast } from "@/hooks/use-toast/use-toast-hook";
import Container from "@/components/Container";

const fallbackImage = "/profile.png";

export default function ProfilePage() {
  const { user, setUser } = useUser();
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [original, setOriginal] = useState<User | null>(user ?? null);
  const { toast } = useToast();

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
  title: "Profil actualizat",
  description: "Modificările au fost salvate cu succes.",
});
    } catch (_err) {
      console.error("Eroare la salvare:", _err);
      alert("A apărut o eroare la salvarea profilului.");
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
      <h1 className="text-3xl font-bold text-foreground mb-8">Profilul meu</h1>

      <div className="bg-card shadow-md rounded-2xl p-6 flex flex-col items-center gap-6">
        <div className="relative">
           <img
              src={user?.profilePicture || fallbackImage}
              alt="Profil"
              loading="lazy"
              className="w-32 h-32 rounded-full object-cover border-4 border-primary shadow"
            />
          {isEditing && (
            <label
              htmlFor="profile-picture"
              className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full cursor-pointer shadow"
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
          )}
        </div>

        <div className="w-full space-y-4">
          {isEditing ? (
            <>
              <ProfileInput label="Nume" value={user?.nume} onChange={handleChange("nume")} />
              <ProfileInput label="Prenume" value={user?.prenume} onChange={handleChange("prenume")} />
              <ProfileInput label="Funcție" value={user?.functie} onChange={handleChange("functie")} />
              <ProfileInput label="Telefon" value={user?.telefon || ""} onChange={handleChange("telefon")} />
            </>
          ) : (
            <>
              <ProfileField label="Nume complet" value={`${user?.nume ?? ""} ${user?.prenume ?? ""}`} />
              <ProfileField label="Email" value={user?.email} />
              <ProfileField label="Funcție" value={user?.functie} />
              <ProfileField label="Telefon" value={user?.telefon || "-"} />
            </>
          )}
        </div>

        <div className="flex gap-4 mt-6">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={isSaving}
                 className="px-6 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/80 transition"
              >
                {isSaving ? "Se salvează..." : "Salvează"}
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-2 bg-muted text-foreground rounded-xl hover:bg-muted/70 transition"
              >
                Anulează
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/80 transition"
            >
              Editează
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
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-base font-medium text-foreground">{value}</p>
    </div>
  );
}

function ProfileInput({ label, value, onChange }: { label: string; value?: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <input
        type="text"
        value={value || ""}
        onChange={onChange}
        className="text-base font-medium text-foreground w-full bg-transparent border-b border-border focus:outline-none focus:border-primary"
      />
    </div>
  );
}
