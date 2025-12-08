# Database Migrations

## Migration History

### 2024-12-19: Fix User Role Default
**Files**: `database/migrations/archive/20241219_fix_user_role_default.sql`

**Purpose**: Set default role to 'customer' for public registrations

**Changes**:
- ALTER TABLE users MODIFY role DEFAULT 'customer'
- UPDATE existing test users

**Status**: Executed and archived

## Migration Procedures

### Running Migrations

1. **Backup Database**
   ```sql
   mysqldump -u root -p grocery_db > backup.sql
   ```

2. **Review Migration SQL**
   - Check WHERE clauses
   - Verify data impact

3. **Execute Migration**
   ```sql
   USE grocery_db;
   SOURCE database/migrations/migration_file.sql;
   ```

4. **Verify Changes**
   - Check table structure
   - Verify data integrity

### Creating New Migrations

1. Create SQL file: `database/migrations/YYYYMMDD_description.sql`
2. Include:
   - Comments explaining purpose
   - Pre-migration checks
   - Migration SQL
   - Verification queries
3. Test in development first
4. Document in this file

## Archive Location

Executed migrations are archived in:
`database/migrations/archive/`

## Related Documentation
- [Schema Overview](01-schema-overview.md)
- [Tables](02-tables.md)

