# Prisma Migrations

## Trigram search indexes

The migration `20250812090000_add_search_trgm_indexes` enables the `pg_trgm` extension and
adds GIN indexes that accelerate substring searches across frequently queried text columns
(`Echipament.nume`, `Echipament.serie`, `Angajat.numeComplet`, `Angajat.email`, `Angajat.functie`,
`Angajat.telefon`, `Angajat.cDataUsername`, and `Angajat.cDataId`).

### Deploying

1. Ensure the database user has privileges to install extensions in the target schema.
2. Run the migrations as usual:

   ```bash
   npm --prefix server run prisma:migrate:deploy
   ```

   or, if you prefer Prisma CLI directly:

   ```bash
   cd server
   npx prisma migrate deploy
   ```

   The migration is idempotent thanks to `IF NOT EXISTS` guards.

### Validating query plans

To confirm PostgreSQL is using the trigram indexes for the global search endpoints run:

```bash
cd server
npx ts-node scripts/analyze-search-plan.ts "search term"
```

The script prints the `EXPLAIN` plans for the equipment and employee search queries. Look for
`Bitmap Index Scan`/`Bitmap Heap Scan` lines that reference the new `*_trgm_idx` indexes. If a
sequential scan still appears, double-check that the extension is installed and statistics are
fresh (`ANALYZE`).

### Troubleshooting

- If migration deployment fails with `permission denied to create extension`, ask your DBA to
  enable the `pg_trgm` extension or run `CREATE EXTENSION pg_trgm` manually using a privileged
  connection.
- After enabling the extension manually rerun `npx prisma migrate deploy` to mark the migration
  as applied.