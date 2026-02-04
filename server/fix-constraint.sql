-- Manual Fix: Remove Equipment Unique Constraint
-- 
-- If the migration didn't work and you still can't add equipment
-- with the same type and N/A serial number, run this SQL directly
-- in your database.
--
-- How to run:
-- 1. Connect to your PostgreSQL database
-- 2. Run this SQL command
--
-- Example using psql:
--   psql -U your_user -d your_database -f fix-constraint.sql
--
-- Example using pgAdmin or other GUI:
--   Copy and paste this SQL and execute

-- Check if constraint exists
SELECT 
  i.relname as constraint_name,
  a.attname as column_name
FROM 
  pg_class t,
  pg_class i,
  pg_index ix,
  pg_attribute a
WHERE 
  t.oid = ix.indrelid
  AND i.oid = ix.indexrelid
  AND a.attrelid = t.oid
  AND a.attnum = ANY(ix.indkey)
  AND t.relkind = 'r'
  AND t.relname = 'Echipament'
  AND i.relname LIKE '%serie%';

-- Drop the constraint if it exists
-- This will NOT error if constraint doesn't exist
DROP INDEX IF EXISTS "Echipament_tip_serie_key";

-- Verify it's gone
SELECT 
  i.relname as constraint_name
FROM 
  pg_class t,
  pg_class i,
  pg_index ix
WHERE 
  t.oid = ix.indrelid
  AND i.oid = ix.indexrelid
  AND t.relkind = 'r'
  AND t.relname = 'Echipament'
  AND i.relname = 'Echipament_tip_serie_key';

-- Should return no rows if successfully removed

-- Test: Try to insert duplicate N/A serial numbers
-- (You can skip this test if you prefer)
/*
INSERT INTO "Echipament" (id, nume, tip, serie, stare, "createdAt")
VALUES 
  ('test-constraint-1', 'Test 1', 'TEST', 'N/A', 'Functional', NOW()),
  ('test-constraint-2', 'Test 2', 'TEST', 'N/A', 'Functional', NOW());

-- If successful, clean up test data
DELETE FROM "Echipament" WHERE id LIKE 'test-constraint-%';
*/
