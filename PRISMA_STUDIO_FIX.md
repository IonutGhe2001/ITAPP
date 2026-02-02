# Fix for Prisma Studio AngajatDocument Error

## Problem
When opening the `Angajat` model in Prisma Studio, you see an error:
```
The table `public.AngajatDocument` does not exist in the current database.
```

## Root Cause
The `AngajatDocument` table was added to the Prisma schema but the migration hasn't been applied to your local database yet. The migration file exists at:
```
server/prisma/migrations/20260129141755_add_angajat_documents/migration.sql
```

## Solution

### Step 1: Apply Pending Migrations
Navigate to the server directory and run the migration deploy command:

```bash
cd server
npx prisma migrate deploy
```

This will apply all pending migrations, including the one that creates the `AngajatDocument` table.

### Step 2: Regenerate Prisma Client (if needed)
If you still see issues, regenerate the Prisma Client:

```bash
npx prisma generate
```

### Step 3: Restart Prisma Studio
Close Prisma Studio and restart it:

```bash
npx prisma studio
```

## Alternative: Reset Database (Use with Caution!)
⚠️ **WARNING**: This will delete all data in your database!

If you're in development and don't mind losing data, you can reset the entire database:

```bash
cd server
npx prisma migrate reset
```

This will:
1. Drop the database
2. Recreate it
3. Apply all migrations
4. Run the seed script (if configured)

## Verification
After applying the migration, you should be able to:
1. Open Prisma Studio
2. Navigate to the `Angajat` model without errors
3. Navigate to the `AngajatDocument` model and see the table structure

## What This Table Does
The `AngajatDocument` table stores documents associated with employees (Angajat). It includes:
- Document name
- File path
- Document type
- File size
- Upload timestamp
- Uploader information

This is used in the employee profile page's "Documents" tab.
