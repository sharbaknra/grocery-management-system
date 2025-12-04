# Migration: Fix User Role Default

**Date:** 2024-12-19  
**File:** `20241219_fix_user_role_default.sql`  
**Issue:** Users registered via public endpoint were not assigned 'customer' role, causing authorization test failures

## Purpose

1. **Change database default** - Set `users.role` column default to `'customer'` so all new registrations default to customer role
2. **Fix existing test data** - Correct test users that were incorrectly assigned 'staff' role during testing

## Pre-Migration Checklist

- [ ] Backup the database
- [ ] Review the WHERE clauses in UPDATE statements
- [ ] Ensure you know which users are real staff vs test users
- [ ] Test in development/staging environment first

## How to Run

### Option 1: Via MySQL Command Line
```bash
mysql -u your_username -p grocery_db < database/migrations/20241219_fix_user_role_default.sql
```

### Option 2: Via MySQL Workbench
1. Open MySQL Workbench
2. Connect to your database
3. Open the SQL file
4. Review and modify WHERE clauses if needed
5. Execute the script

### Option 3: Via Node.js Script (Recommended for CI/CD)
```bash
node -e "const db = require('./config/db'); const fs = require('fs'); const sql = fs.readFileSync('database/migrations/20241219_fix_user_role_default.sql', 'utf8'); db.promise().query(sql).then(() => console.log('Migration successful')).catch(console.error);"
```

## Verification

After running the migration, verify:

1. **Check default constraint:**
   ```sql
   SHOW CREATE TABLE users;
   ```
   Should show `DEFAULT 'customer'` in the role column definition.

2. **Check test users:**
   ```sql
   SELECT id, email, role FROM users WHERE email LIKE 'newcustomer%' OR email LIKE 'testcustomer%';
   ```
   All should have `role = 'customer'`.

3. **Check recent registrations:**
   ```sql
   SELECT id, email, role, created_at FROM users ORDER BY created_at DESC LIMIT 10;
   ```
   Recent registrations should have `role = 'customer'`.

## Rollback (if needed)

If you need to rollback:

```sql
-- Revert default (but you'll need to decide what the original default was)
ALTER TABLE users
  MODIFY COLUMN role ENUM('admin','staff','customer') NOT NULL;

-- Note: We don't automatically revert the role changes for test users
-- as we assume fixing them was intentional
```

## Related Code Changes

This migration works in conjunction with:
- `controllers/userController.js` - Now explicitly sets role to 'customer'
- `models/userModel.js` - Now accepts and inserts role parameter

## Notes

- The UPDATE statements use `WHERE ... AND role = 'staff'` to avoid accidentally changing users that are already correct
- Review the WHERE clauses before running in production to ensure you're only updating test users
- If you have test users with different email patterns, add additional UPDATE statements following the same pattern

