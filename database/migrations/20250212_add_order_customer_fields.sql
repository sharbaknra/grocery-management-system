-- Migration: Add customer_name and customer_phone to orders table
-- Date: 2025-02-12
-- Description:
--   - Adds nullable customer_name and customer_phone columns to orders
--   - Normalizes existing status values and marks all remaining Pending as Completed
--     (per QA requirement to clear legacy pending statuses)

USE grocery_db;

-- Step 1: Add customer fields to orders
-- Note: MySQL before 8.0 does not support ADD COLUMN IF NOT EXISTS, so we rely
-- on the migration runner to ignore \"Duplicate column\" errors when re-running.
ALTER TABLE orders
  ADD COLUMN customer_name VARCHAR(255) NULL AFTER discount_applied;

ALTER TABLE orders
  ADD COLUMN customer_phone VARCHAR(50) NULL AFTER customer_name;

-- Step 2: Normalize status casing and clear legacy pending statuses
-- Normalize any case-variants
UPDATE orders
SET status = 'Completed'
WHERE status IS NULL
   OR status = ''
   OR LOWER(status) = 'completed';

-- Per project requirement: clean all remaining Pending statuses as well
UPDATE orders
SET status = 'Completed'
WHERE LOWER(status) = 'pending';

-- Optional: ensure only allowed enum values remain (Pending/Completed/Cancelled)
-- (Assumes ENUM already defined as such in schema.)


