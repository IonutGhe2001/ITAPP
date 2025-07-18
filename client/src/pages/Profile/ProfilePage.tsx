import React, { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { getCurrentUser } from "@/services/authService";

const fallbackImage = "/src/assets/profile.png";

type UserProfile = {
  nume: string;
  prenume: string;
  email: string;
  functie: string;
  telefon?: string;
  profilePicture?: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser((prev) => prev ? { ...prev, profilePicture: reader.result as string } : prev);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">Profilul meu</h1>

      <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center gap-6">
        <div className="relative">
          <img
            src={user?.profilePicture || fallbackImage}
            alt="Profil"
            className="w-32 h-32 rounded-full object-cover border-4 border-primary shadow"
          />
          <label
            htmlFor="profile-picture"
            className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer shadow"
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
        </div>

        <div className="w-full space-y-4">
          <ProfileField label="Nume complet" value={`${user?.nume ?? ""} ${user?.prenume ?? ""}`} />
          <ProfileField label="Email" value={user?.email} />
          <ProfileField label="Funcție" value={user?.functie} />
          <ProfileField label="Telefon" value={user?.telefon || "-"} />
        </div>
      </div>
    </div>
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
