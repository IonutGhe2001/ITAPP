-- DropIndex
-- This removes the unique constraint on [tip, serie] combination
-- to allow multiple equipment with the same serial number (e.g., "N/A" for equipment without serial numbers)
DROP INDEX IF EXISTS "Echipament_tip_serie_key";
