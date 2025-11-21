-- Migration: Fix user role default and existing test users
-- Date: 2024-12-19
-- Description: Changes users.role default to 'customer' and fixes existing test users
--              that were incorrectly assigned 'staff' role during testing

USE grocery_db;

-- Step 1: Change the default value of role column to 'customer'
-- This ensures all new registrations default to customer role
-- IMPORTANT: This also updates the ENUM to include 'customer' if it doesn't already exist
ALTER TABLE users
  MODIFY COLUMN role ENUM('admin','staff','customer') NOT NULL DEFAULT 'customer';

-- Step 2: Fix existing test users that were incorrectly assigned 'staff' role
-- Only update users matching test patterns to avoid affecting real staff members
-- Review the WHERE clause before running in production!

-- Option A: Fix users matching email pattern (for test users created during testing)
UPDATE users
SET role = 'customer'
WHERE email LIKE 'newcustomer%'
  AND role = 'staff';

-- Option B: Fix users matching email pattern (alternative pattern)
UPDATE users
SET role = 'customer'
WHERE email LIKE 'testcustomer%'
  AND role = 'staff';

-- Option C: Fix specific known test user IDs (if you know them)
-- UPDATE users SET role = 'customer' WHERE id IN (4,5,6,7,8,9,10,11,12) AND role = 'staff';

-- Verify the changes
-- Run these queries to verify:
-- SELECT id, email, role FROM users WHERE email LIKE 'newcustomer%' OR email LIKE 'testcustomer%';
-- SELECT id, email, role FROM users WHERE role = 'customer' ORDER BY created_at DESC LIMIT 10;

-- Verify default constraint
SHOW CREATE TABLE users;

