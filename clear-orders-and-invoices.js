// Dangerous helper script: clears ALL orders and invoice-related data.
// This is intended for local testing only.

const db = require("./config/db");

async function clearOrders() {
  try {
    console.log("⚠️  This will DELETE ALL orders and order_items from the database.");
    console.log("   Use only in a local/test environment.\n");

    // Delete from child table first to satisfy FK constraints
    const [itemsResult] = await db.promise().query("DELETE FROM order_items");
    console.log(`✅ Deleted ${itemsResult.affectedRows} order_items rows`);

    const [ordersResult] = await db.promise().query("DELETE FROM orders");
    console.log(`✅ Deleted ${ordersResult.affectedRows} orders rows`);

    console.log("\n✅ All orders and invoice data have been cleared.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to clear orders:", error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

clearOrders();


