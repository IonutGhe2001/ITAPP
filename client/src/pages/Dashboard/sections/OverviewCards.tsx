"use client";

import { useEffect, useState } from "react";
import { UsersIcon, LaptopIcon } from "lucide-react";
import { getAngajati } from "@/services/angajatiService";
import { getEchipamente } from "@/services/echipamenteService";

const cardStyles = "rounded-2xl p-6 bg-white border border-border shadow-sm hover:shadow-md transition-all flex justify-between items-center";

const iconStyles = "w-12 h-12 flex items-center justify-center rounded-full text-white shadow-inner";

export default function OverviewCards() {
  const [totalAngajati, setTotalAngajati] = useState(0);
  const [totalEchipamente, setTotalEchipamente] = useState(0);

  useEffect(() => {
    getAngajati().then((res) => setTotalAngajati(res.data.length));
    getEchipamente().then((res) => setTotalEchipamente(res.data.length));
  }, []);

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Card Colegi */}
      <div className={cardStyles}>
        <div>
          <p className="text-sm text-muted-foreground mb-1">Colegi</p>
          <p className="text-3xl font-bold text-foreground">{totalAngajati}</p>
        </div>
        <div className={`${iconStyles} bg-gradient-to-br from-rose-500 to-pink-400`}>
          <UsersIcon className="w-6 h-6" />
        </div>
      </div>

      {/* Card Echipamente */}
      <div className={cardStyles}>
        <div>
          <p className="text-sm text-muted-foreground mb-1">Echipamente</p>
          <p className="text-3xl font-bold text-foreground">{totalEchipamente}</p>
        </div>
        <div className={`${iconStyles} bg-gradient-to-br from-red-500 to-orange-400`}>
          <LaptopIcon className="w-6 h-6" />
        </div>
      </div>
    </section>
  );
}
