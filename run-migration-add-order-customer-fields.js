// Script to execute the orders customer fields & status normalization migration
// Uses the existing database connection from config/db.js

const db = require("./config/db");
const fs = require("fs");
const path = require("path");

async function runMigration() {
  try {
    console.log("🔄 Starting migration: Add customer fields to orders and normalize statuses...\n");

    const migrationPath = path.join(__dirname, "database", "migrations", "20250212_add_order_customer_fields.sql");
    const sql = fs.readFileSync(migrationPath, "utf8");

    // Basic cleanup: remove comments and USE statements
    const lines = sql.split("\n");
    const cleanLines = lines
      .map((line) => line.trim())
      .filter((line) => !line.startsWith("--") && line && !line.toUpperCase().startsWith("USE "))
      .join("\n");

    // Split into individual statements on semicolon
    const statements = cleanLines
      .split(";")
      .map((s) => s.trim().replace(/\n/g, " ").replace(/\s+/g, " "))
      .filter((s) => s.length > 0)
      .map((s) => s + ";");

    console.log(`Found ${statements.length} SQL statements to execute:\n`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (!statement || statement.length < 10) continue;

      try {
        console.log(`[${i + 1}/${statements.length}] Executing: ${statement.substring(0, 80)}...`);
        const [result] = await db.promise().query(statement);
        if (result && typeof result.affectedRows !== "undefined") {
          console.log(`   ✅ Affected rows: ${result.affectedRows}`);
        } else {
          console.log("   ✅ Statement executed successfully");
        }
      } catch (error) {
        // Allow idempotent re-runs: ignore duplicate/exists errors for columns
        if (
          error.message.includes("Duplicate column") ||
          error.message.includes("already exists")
        ) {
          console.log(`   ⚠️  ${error.message} - continuing (column already present)`);
          continue;
        }
        console.error(`   ❌ Error executing statement: ${error.message}`);
        throw error;
      }
    }

    console.log("\n✅ Migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Migration failed:");
    console.error(error.message);
    if (error.stack) {
      console.error("\nStack trace:");
      console.error(error.stack);
    }
    process.exit(1);
  }
}

runMigration();


