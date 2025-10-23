-- Enable pg_trgm for trigram indexes (safe to run multiple times)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create trigram GIN indexes to accelerate case-insensitive substring searches
CREATE INDEX IF NOT EXISTS "Echipament_nume_trgm_idx"
  ON "Echipament" USING gin ("nume" gin_trgm_ops);

CREATE INDEX IF NOT EXISTS "Echipament_serie_trgm_idx"
  ON "Echipament" USING gin ("serie" gin_trgm_ops);

CREATE INDEX IF NOT EXISTS "Angajat_numeComplet_trgm_idx"
  ON "Angajat" USING gin ("numeComplet" gin_trgm_ops);

CREATE INDEX IF NOT EXISTS "Angajat_email_trgm_idx"
  ON "Angajat" USING gin ("email" gin_trgm_ops);

CREATE INDEX IF NOT EXISTS "Angajat_functie_trgm_idx"
  ON "Angajat" USING gin ("functie" gin_trgm_ops);

CREATE INDEX IF NOT EXISTS "Angajat_telefon_trgm_idx"
  ON "Angajat" USING gin ("telefon" gin_trgm_ops);

CREATE INDEX IF NOT EXISTS "Angajat_cDataUsername_trgm_idx"
  ON "Angajat" USING gin ("cDataUsername" gin_trgm_ops);

CREATE INDEX IF NOT EXISTS "Angajat_cDataId_trgm_idx"
  ON "Angajat" USING gin ("cDataId" gin_trgm_ops);