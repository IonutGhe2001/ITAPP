export interface User {
  nume: string;
  prenume: string;
  functie: string;
  profilePicture?: string | null;
  digitalSignature?: string | null;
  email?: string;
  telefon?: string;
  locatie?: string | null;
  departament?: string | null;
  lastLogin?: string | null;
}
