import { FaBell, FaUserCircle } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/echipamente": "Echipamente",
  "/colegi": "Colegi",
};

export default function Header() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "Pagina";

  const [user, setUser] = useState<{
    nume: string;
    prenume: string;
    functie: string;
  } | null>(null);

 useEffect(() => {
  const token = localStorage.getItem("token");
  console.log("TOKEN IN HEADER:", token); 

  if (!token) return;

  axios.get("/api/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => {
    console.log("USER FROM /me:", res.data); 
    setUser(res.data);
  }).catch((err) => {
    console.error("Eroare la /me:", err);
  });
}, []);

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white border-b-2 border-primary shadow-sm sticky top-0 z-40 text-gray-900">
      <h1 className="text-xl font-bold tracking-tight">{title}</h1>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-gray-100">
          <FaBell className="text-primary text-lg" />
        </button>

        {user && (
          <div className="flex items-center gap-3 bg-primary/10 px-3 py-2 rounded-lg">
            <FaUserCircle className="text-primary text-2xl" />
            <div className="text-sm leading-tight">
              <p className="font-semibold">
                {user.nume} {user.prenume?.charAt(0)}.
              </p>
              <p className="text-xs text-primary">{user.functie}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
