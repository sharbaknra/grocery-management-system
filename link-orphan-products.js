/**
 * Link all products without a supplier_id to a random available supplier.
 *
 * Usage:
 *   node link-orphan-products.js
 *
 * Notes:
 * - Requires at least one supplier in the database.
 * - Only products with supplier_id NULL or 0 are updated.
 */

const db = require("./config/db");

async function linkOrphanProducts() {
  const connection = db.promise();

  try {
    const [suppliers] = await connection.query(
      "SELECT id, name FROM suppliers ORDER BY id ASC"
    );

    if (!suppliers.length) {
      console.error("No suppliers found. Create a supplier before linking products.");
      process.exit(1);
    }

    const [orphanProducts] = await connection.query(
      "SELECT id, name FROM products WHERE supplier_id IS NULL OR supplier_id = 0"
    );

    if (!orphanProducts.length) {
      console.log("All products already have suppliers assigned. Nothing to do.");
      process.exit(0);
    }

    let linkedCount = 0;
    for (const product of orphanProducts) {
      const supplier =
        suppliers[Math.floor(Math.random() * suppliers.length)];
      await connection.query(
        "UPDATE products SET supplier_id = ? WHERE id = ?",
        [supplier.id, product.id]
      );
      linkedCount++;
      console.log(
        `Linked product "${product.name}" (ID ${product.id}) to supplier "${supplier.name}" (ID ${supplier.id}).`
      );
    }

    console.log(
      `\n✅ Completed. Linked ${linkedCount} product(s) to available suppliers.`
    );
  } catch (error) {
    console.error("Failed to link products:", error);
    process.exit(1);
  } finally {
    db.end?.();
  }
}

linkOrphanProducts();


