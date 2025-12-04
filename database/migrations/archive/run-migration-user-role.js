// Script to execute the user role migration
// Uses the existing database connection from config/db.js

const db = require('./config/db');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  try {
    console.log('🔄 Starting migration: Fix user role default...\n');
    
    // Read the migration SQL file
    const migrationPath = path.join(__dirname, 'database', 'migrations', '20241219_fix_user_role_default.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    // Split SQL into individual statements
    // Remove comments (lines starting with --) and USE statements, but keep ALTER and UPDATE
    const lines = sql.split('\n');
    const cleanLines = lines
      .map(line => line.trim())
      .filter(line => !line.startsWith('--') && line && !line.startsWith('USE grocery_db'))
      .join('\n');
    
    // Split by semicolon and filter out empty/verification-only statements
    const statements = cleanLines
      .split(';')
      .map(s => s.trim().replace(/\n/g, ' ').replace(/\s+/g, ' '))
      .filter(s => s.length > 10)
      .filter(s => s.toUpperCase().startsWith('ALTER') || s.toUpperCase().startsWith('UPDATE'))
      .map(s => s + ';');
    
    console.log(`Found ${statements.length} SQL statements to execute:\n`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      if (!statement || statement.length < 10) continue; // Skip very short/empty statements
      
      try {
        console.log(`[${i + 1}/${statements.length}] Executing: ${statement.substring(0, 60)}...`);
        
        const [result] = await db.promise().query(statement);
        
        if (result.affectedRows !== undefined) {
          console.log(`   ✅ Affected rows: ${result.affectedRows}`);
        } else {
          console.log(`   ✅ Statement executed successfully`);
        }
      } catch (error) {
        // If it's a "Table doesn't exist" or similar, skip verification queries
        if (error.message.includes('SHOW') || error.message.includes('SELECT')) {
          console.log(`   ⏭️  Skipping verification query`);
          continue;
        }
        
        // If column doesn't exist or already has the right structure, that's okay
        if (error.message.includes('Unknown column') || 
            error.message.includes('Duplicate column') ||
            error.message.includes('already exists')) {
          console.log(`   ⚠️  ${error.message} - This might be expected`);
          continue;
        }
        
        throw error; // Re-throw unexpected errors
      }
    }
    
    console.log('\n✅ Migration completed successfully!\n');
    
    // Verify the changes
    console.log('📊 Verifying changes...\n');
    
    try {
      // Check table structure
      const [tableInfo] = await db.promise().query(`
        SELECT COLUMN_NAME, COLUMN_TYPE, COLUMN_DEFAULT, IS_NULLABLE
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = 'grocery_db' 
          AND TABLE_NAME = 'users' 
          AND COLUMN_NAME = 'role'
      `);
      
      if (tableInfo.length > 0) {
        console.log('Role column information:');
        console.log(`  Type: ${tableInfo[0].COLUMN_TYPE}`);
        console.log(`  Default: ${tableInfo[0].COLUMN_DEFAULT}`);
        console.log(`  Nullable: ${tableInfo[0].IS_NULLABLE}`);
        
        if (tableInfo[0].COLUMN_DEFAULT === 'customer') {
          console.log('\n✅ Default value is correctly set to "customer"');
        } else {
          console.log(`\n⚠️  Default value is "${tableInfo[0].COLUMN_DEFAULT}" (expected "customer")`);
        }
        
        if (tableInfo[0].COLUMN_TYPE.includes('customer')) {
          console.log('✅ ENUM includes "customer"');
        } else {
          console.log('⚠️  ENUM might not include "customer"');
        }
      }
      
      // Check existing test users
      const [testUsers] = await db.promise().query(`
        SELECT id, email, role 
        FROM users 
        WHERE email LIKE 'newcustomer%' OR email LIKE 'testcustomer%'
        LIMIT 5
      `);
      
      if (testUsers.length > 0) {
        console.log(`\nFound ${testUsers.length} test users:`);
        testUsers.forEach(user => {
          console.log(`  ID ${user.id}: ${user.email} - role: ${user.role}`);
        });
      }
      
    } catch (error) {
      console.log(`⚠️  Could not verify changes: ${error.message}`);
    }
    
    console.log('\n🎉 Migration script completed!');
    console.log('\nNext steps:');
    console.log('  1. Restart your server');
    console.log('  2. Run the test: node test-authorization-fix.js');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:');
    console.error(error.message);
    if (error.stack) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }
    process.exit(1);
  }
}

runMigration();

